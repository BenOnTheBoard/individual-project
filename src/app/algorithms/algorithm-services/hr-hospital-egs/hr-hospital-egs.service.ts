import { Injectable } from '@angular/core';
import { ExtendedGaleShapley } from '../../abstract-classes/ExtendedGaleShapley';
import { Agent } from '../../interfaces/Agent';
import { AlgorithmData } from '../../interfaces/AlgorithmData';
import { Hospital } from '../../interfaces/Hospital';

@Injectable({
  providedIn: 'root',
})
export class HrHospitalEgsService extends ExtendedGaleShapley {
  group1Name = 'resident';
  group2Name = 'hospital';

  group2Agents: Map<String, Hospital> = new Map();

  hospitalCapacity: Map<string, string> = new Map();

  freeAgentsOfGroup2: Array<Agent> = new Array();

  generateAgents() {
    for (let i = 1; i < this.numberOfAgents + 1; i++) {
      const group1AgentName = this.group1Name + i;
      const agent: Agent = {
        name: group1AgentName,
        match: new Array(),
        ranking: new Array(),
      };
      this.group1Agents.set(group1AgentName, agent);
      this.freeAgents.push(agent);
    }

    for (let i = 0; i < this.numberOfGroup2Agents; i++) {
      const currentLetter = String.fromCharCode(65 + i);
      const group2AgentName = this.group2Name + currentLetter;

      const availableSpaces = this.getRandomInt(1, this.numberOfAgents - 2);
      const agent = {
        name: group2AgentName,
        match: new Array(),
        ranking: new Array(),
        availableSpaces,
      };

      this.group2Agents.set(group2AgentName, agent);
      this.freeAgentsOfGroup2.push(agent);
      this.hospitalCapacity.set(currentLetter, String(availableSpaces));
    }
    this.algorithmSpecificData['hospitalCapacity'] = this.hospitalCapacity;
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getNextProposee(hospital: Hospital): Agent | null {
    for (const proposee of hospital.ranking) {
      if (proposee.match[0] != hospital) return proposee;
    }
    return null;
  }

  getWorstResident(hospital: Hospital): Agent {
    const positionMap: Map<number, Agent> = new Map();

    for (const resident of hospital.match) {
      positionMap.set(this.getRank(hospital, resident), resident);
    }

    // use destructuring assingment to extract data from array into distinct variables
    // return the worst resident from the hospital's matches
    return positionMap.get(Math.max(...Array.from(positionMap.keys())));
  }

  breakAssignment(resident: Agent, hospital): void {
    this.removeLine(resident, hospital, 'green');
    this.stylePrefs('group1', resident, hospital, 'grey');
    this.stylePrefs('group2', hospital, resident, 'red');

    const hospitalChar = this.utils.getAsChar(hospital);
    const colourHex = this.colourHexService.getHex('black');
    this.hospitalCapacity.set(
      hospitalChar,
      `{${colourHex}${String(hospital.availableSpaces)}}`,
    );

    // unassign r and h'
    this.saveStep(5, {
      '%oldHospital%': resident.match[0].name,
      '%resident%': resident.name,
    });

    this.stylePrefs('group2', hospital, resident, 'grey');

    this.saveStep(1);

    // remove
    const rankOfResident = this.getRank(hospital, resident);
    const rankOfHospital = this.getRank(resident, hospital);
    resident.match.splice(0, 1);
    hospital.match.splice(this.getRank(hospital, resident), 1);
    hospital.ranking.splice(rankOfResident, 1);
    resident.ranking.splice(rankOfHospital, 1);
  }

  provisionallyAssign(resident: Agent, hospital: Hospital) {
    // provisionally assign r to h;
    const proposeeChar = this.utils.getAsChar(hospital);

    this.changeLineColour(resident, hospital, 'red', 'green');
    this.stylePrefsMutual(resident, hospital, 'green');

    if (hospital.match.length >= hospital.availableSpaces - 1) {
      const colourHex = this.colourHexService.getHex('green');
      this.hospitalCapacity.set(
        proposeeChar,
        `{${colourHex}${String(hospital.availableSpaces)}}`,
      );
    }

    resident.match[0] = hospital;
    hospital.match.push(resident);
  }

  removeRuledOutPrefs(resident: Agent, hospital: Hospital): void {
    // given h and r - remove h' of h on r's list
    const hospitalRank = this.getRank(resident, hospital);

    if (hospitalRank + 1 < resident.ranking.length) {
      // for each successor h' of h on r's list
      this.saveStep(7, {
        '%resident%': resident.name,
        '%hospital%': hospital.name,
      });

      for (let i = hospitalRank + 1; i < resident.ranking.length; i++) {
        const removedHospital = resident.ranking[i];
        const residentRank = this.getRank(removedHospital, resident);

        removedHospital.ranking.splice(residentRank, 1);

        // remove hospital from resident
        resident.ranking.splice(i, 1);
        this.stylePrefsMutual(resident, removedHospital, 'grey');
        // remove h' and r from each others preferance list
        this.saveStep(8, {
          '%hospital%': removedHospital.name,
          '%resident%': resident.name,
        });
      }
    }
  }

  removeRuledOutPrefsOld(resident: Agent, hospital: Hospital): void {
    if (hospital.match.length < hospital.availableSpaces) return;

    const worstResident: Agent = this.getWorstResident(hospital);
    const worstResidentRank: number = this.getRank(hospital, worstResident);

    // for each successor h' of h on r's list
    this.saveStep(7, {
      '%resident%': resident.name,
      '%hospital%': hospital.name,
    });

    for (let i = worstResidentRank + 1; i < hospital.ranking.length; i++) {
      const resident = hospital.ranking[i];
      const hospitalRank = this.getRank(resident, hospital);
      this.relevantPrefs.push(this.utils.getAsChar(resident));

      this.stylePrefsMutual(resident, hospital, 'grey');

      // remove r' and h from each others preferance list
      this.saveStep(8, {
        '%hospital%': hospital.name,
        '%resident%': resident.name,
      });

      resident.ranking.splice(hospitalRank, 1);
      hospital.ranking.splice(i, 1);
      i--;

      this.relevantPrefs.pop();
    }
  }

  // returns true if there is a resident on the list that is not matched with that hospital
  checkHospitalPrefList(hospital: Hospital) {
    for (const resident of hospital.ranking) {
      // if they are not matched to the hospital
      if (resident.match[0] != hospital) return true;
    }
    return false;
  }

  // returns all the hospitals that should be looked at
  // they are undersubbed and there is someone not assigned to them that the hospital wants
  checkFreeHospitals() {
    const freeHospitals = [];
    for (const hospital of this.group2Agents.values()) {
      const hospitalCap = hospital.availableSpaces;

      // if hospital in undersubbed and there is someone on the list that is not assigned to them
      if (
        hospital.match.length < hospitalCap &&
        this.checkHospitalPrefList(hospital)
      ) {
        freeHospitals.push(hospital.name);
      }
    }

    return freeHospitals;
  }

  match(): AlgorithmData {
    // "Set each hospital and resident to be completely free",
    this.saveStep(1);

    // while a HOSPITAL h is under-subscribed and
    // h's list contains a a RESIDENT r not assigned to h
    while (this.freeAgentsOfGroup2.length > 0) {
      // get first hospital on list
      const currentHospital = this.freeAgentsOfGroup2[0] as Hospital;

      // "While some hospital h is - undersubscibed,
      // and has a resident r on h's preferance list that is no assigned to h",
      this.saveStep(2, { '%hospital%': currentHospital.name });

      if (
        currentHospital.ranking.length <= 0 ||
        !this.getNextProposee(currentHospital)
      ) {
        this.freeAgentsOfGroup2.shift();
      } else {
        const proposee: Agent = this.getNextProposee(currentHospital);

        // a RESIDENT r that is not assigned to h, but is on its pref list
        // "r := first resident on h's prefernace list not assigned to h",
        this.saveStep(3, { '%resident%': proposee.name });

        // if proposee is assigned to a different hospital then un assign
        // if r is assigned to another hospital h
        this.saveStep(4, { '%resident%': proposee.name });

        if (proposee.match[0] != null) {
          this.breakAssignment(proposee, proposee.match[0]);
        }

        // provisionally assign r to h
        this.provisionallyAssign(proposee, currentHospital);
        this.saveStep(6, {
          '%resident%': proposee.name,
          '%hospital%': currentHospital.name,
        });

        this.removeRuledOutPrefs(proposee, currentHospital);

        this.freeAgentsOfGroup2 = this.checkFreeHospitals();

        // continous loop as guessed + not clear way to define/get free hospitals
        // rankings should be deleted until convergence?

        this.freeAgents.shift();
      }
    }

    // stable matching found
    this.saveStep(9);
    return;
  }
}

// MAY PRODUCE UNSTABLE MATCHINGS DUE TO BLOCKING PAIRS - CHECKED BY WEBAPP
// OTHER ISSUES - SOME HOSPITALS/RESIDENTS ARE NOT MACTHED DUE To TAKEN BY OTHER HOSPITALS
// AND THEIR PREFERANCE LIST BEING EMPTYED BY PREVOUIS STEPS

// NEEDS RESEARCJ TO FIX - I THINK I PRODUCES
