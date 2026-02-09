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

  hospitalCapacity: Map<string, number> = new Map();

  freeAgentsOfGroup2: Array<String> = new Array();

  generateAgents() {
    for (let i = 1; i < this.numberOfAgents + 1; i++) {
      const group1AgentName = this.group1Name + i;

      this.group1Agents.set(group1AgentName, {
        name: group1AgentName,
        match: new Array(),
        ranking: new Array(),
      });

      this.freeAgentsOfGroup1.push(group1AgentName);
    }

    for (let i = 0; i < this.numberOfGroup2Agents; i++) {
      const currentLetter = String.fromCharCode(65 + i);
      const group2AgentName = this.group2Name + currentLetter;

      const availableSpaces = this.getRandomInt(1, this.numberOfAgents - 2);

      this.group2Agents.set(group2AgentName, {
        name: group2AgentName,
        match: new Array(),
        ranking: new Array(),
        availableSpaces,
      });

      this.freeAgentsOfGroup2.push(group2AgentName);
      this.hospitalCapacity[currentLetter] = availableSpaces;
    }
    this.algorithmSpecificData['hospitalCapacity'] = this.hospitalCapacity;
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getNextPotentialProposee(hospital: Hospital): Agent | null {
    for (const proposee of hospital.ranking) {
      if (proposee.match[0] != hospital) return proposee;
    }
    return null;
  }

  getWorstResident(hospital: Hospital): Agent {
    const positionMap: Map<number, Agent> = new Map();

    for (const resident of hospital.match) {
      positionMap.set(this.findPositionInRanking(hospital, resident), resident);
    }

    // use destructuring assingment to extract data from array into distinct variables
    // return the worst resident from the hospital's matches
    return positionMap.get(Math.max(...Array.from(positionMap.keys())));
  }

  breakAssignment(resident: Agent, hospital): void {
    // get pos in each rankings lists to remove later
    const matchPosition_resident = this.findPositionInRanking(
      hospital,
      resident,
    );
    const matchPosition_hospital = this.findPositionInRanking(
      resident,
      hospital,
    );

    const matchPosition_resident_original = this.findPositionInOriginalMatches(
      hospital,
      resident,
      'group2',
    );

    this.currentLines = this.removeArrayFromArray(this.currentLines, [
      this.utils.getLastChar(resident.name),
      this.utils.getLastChar(hospital.name),
      'green',
    ]);

    this.changePreferenceStyle(
      this.group1CurrentPreferences,
      this.utils.getLastChar(resident.name),
      this.originalPrefsGroup1
        .get(this.utils.getLastChar(resident.name))
        .findIndex((h) => h == this.utils.getLastChar(hospital.name)),
      'grey',
    );
    this.changePreferenceStyle(
      this.group2CurrentPreferences,
      this.utils.getLastChar(hospital.name),
      matchPosition_resident_original,
      'red',
    );

    const hospitalLastChar = this.utils.getLastChar(hospital.name);
    const colourHex = this.colourHexService.getHex('black');
    this.algorithmSpecificData['hospitalCapacity'][hospitalLastChar] =
      `{${colourHex}${String(hospital.availableSpaces)}}`;

    // unassign r and h'
    this.update(5, {
      '%oldHospital%': resident.match[0].name,
      '%resident%': resident.name,
    });

    this.changePreferenceStyle(
      this.group2CurrentPreferences,
      this.utils.getLastChar(hospital.name),
      matchPosition_resident_original,
      'grey',
    );

    this.update(1);

    // remove hospital from resident match
    resident.match.splice(0, 1);
    // remove resident from hospital match
    hospital.match.splice(
      hospital.match.findIndex(
        (agent: { name: string }) => agent.name == resident.name,
      ),
      1,
    );

    // REMOVE EACH OTHER FROM RANKING LIST
    hospital.ranking.splice(matchPosition_resident, 1); // HOSPITAL
    resident.ranking.splice(matchPosition_hospital, 1); //RESIDENT
  }

  provisionallyAssign(resident: Agent, hospital: Hospital) {
    // provisionally assign r to h;
    const agentLastChar = this.utils.getLastChar(resident.name);
    const proposeeLastChar = this.utils.getLastChar(hospital.name);

    this.currentLines = this.removeArrayFromArray(this.currentLines, [
      agentLastChar,
      proposeeLastChar,
      'red',
    ]);

    const greenLine = [agentLastChar, proposeeLastChar, 'green'];
    this.currentLines.push(greenLine);

    this.changePreferenceStyle(
      this.group1CurrentPreferences,
      agentLastChar,
      this.originalPrefsGroup1
        .get(agentLastChar)
        .findIndex((h) => h == this.utils.getLastChar(hospital.name)),
      'green',
    );

    this.changePreferenceStyle(
      this.group2CurrentPreferences,
      proposeeLastChar,
      this.originalPrefsGroup2
        .get(proposeeLastChar)
        .findIndex((h) => h == this.utils.getLastChar(resident.name)),
      'green',
    );

    if (hospital.match.length >= hospital.availableSpaces - 1) {
      const colourHex = this.colourHexService.getHex('green');
      this.algorithmSpecificData['hospitalCapacity'][proposeeLastChar] =
        `{${colourHex}${String(hospital.availableSpaces)}}`;
    }

    resident.match[0] = hospital;
    hospital.match.push(resident);
  }

  removeRuledOutPreferences(resident: Agent, hospital: Hospital): void {
    // given h and r - remove h' of h on r's list
    const hospitalPosition: number = this.findPositionInRanking(
      resident,
      hospital,
    );

    if (hospitalPosition + 1 < resident.ranking.length) {
      // for each successor h' of h on r's list
      this.update(7, {
        '%resident%': resident.name,
        '%hospital%': hospital.name,
      });

      for (let i = hospitalPosition + 1; i < resident.ranking.length; i++) {
        const removedHospital = resident.ranking[i];
        const residentIndex = this.findPositionInRanking(
          removedHospital,
          resident,
        );

        removedHospital.ranking.splice(residentIndex, 1);

        // remove hsopital from resident
        resident.ranking.splice(i, 1);
        // get index of resident in the removde hospitals og rankings
        const pos = this.originalPrefsGroup2
          .get(this.utils.getLastChar(removedHospital.name))
          .findIndex((h) => h == this.utils.getLastChar(resident.name));
        //  grey out hos from res
        this.changePreferenceStyle(
          this.group1CurrentPreferences,
          this.utils.getLastChar(resident.name),
          i,
          'grey',
        );
        // grey out res from hos
        this.changePreferenceStyle(
          this.group2CurrentPreferences,
          this.utils.getLastChar(removedHospital.name),
          pos,
          'grey',
        );
        // remove h' and r from each others preferance list
        this.update(8, {
          '%hospital%': removedHospital.name,
          '%resident%': resident.name,
        });
      }
    }
  }

  removeRuledOutPreferencesOld(resident: Agent, hospital: Hospital): void {
    if (hospital.match.length < hospital.availableSpaces) return;

    const worstResident: Agent = this.getWorstResident(hospital);
    const worstResidentPosition: number = this.findPositionInRanking(
      hospital,
      worstResident,
    );
    let hospitalRankingClearCounter: number = worstResidentPosition + 1;

    // for each successor h' of h on r's list
    this.update(7, {
      '%resident%': resident.name,
      '%hospital%': hospital.name,
    });

    for (let i = worstResidentPosition + 1; i < hospital.ranking.length; i++) {
      const hospitalPosition: number = this.findPositionInRanking(
        hospital.ranking[i],
        hospital,
      );
      this.relevantPreferences.push(
        this.utils.getLastChar(hospital.ranking[i].name),
      );

      this.changePreferenceStyle(
        this.group1CurrentPreferences,
        this.utils.getLastChar(hospital.ranking[i].name),
        this.originalPrefsGroup1
          .get(this.utils.getLastChar(hospital.ranking[i].name))
          .findIndex((h) => h == this.utils.getLastChar(hospital.name)),
        'grey',
      );
      this.changePreferenceStyle(
        this.group2CurrentPreferences,
        this.utils.getLastChar(hospital.name),
        hospitalRankingClearCounter,
        'grey',
      );

      // remove r' and h from each others preferance list
      this.update(8, {
        '%hospital%': hospital.name,
        '%resident%': hospital.ranking[i].name,
      });

      hospital.ranking[i].ranking.splice(hospitalPosition, 1);
      hospital.ranking.splice(i, 1);
      i--;
      hospitalRankingClearCounter++;

      this.relevantPreferences.pop();
    }
  }

  // returns true if there is a resident on the list that is not matched with that hospital
  checkHospitalPreferanceList(hospital: Hospital) {
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
        this.checkHospitalPreferanceList(hospital)
      ) {
        freeHospitals.push(hospital.name);
      }
    }

    return freeHospitals;
  }

  match(): AlgorithmData {
    // "Set each hospital and resident to be completely free",
    this.update(1);

    // while a HOSPITAL h is under-subscribed and
    // h's list contains a a RESIDENT r not assigned to h
    while (this.freeAgentsOfGroup2.length > 0) {
      // get first hospital on list
      const currentHospital = this.group2Agents.get(this.freeAgentsOfGroup2[0]);

      // "While some hospital h is - undersubscibed,
      // and has a resident r on h's preferance list that is no assigned to h",
      this.update(2, { '%hospital%': currentHospital.name });

      if (
        currentHospital.ranking.length <= 0 ||
        !this.getNextPotentialProposee(currentHospital)
      ) {
        this.freeAgentsOfGroup2.shift();
      } else {
        const potentialProposee: Agent =
          this.getNextPotentialProposee(currentHospital);

        // a RESIDENT r that is not assigned to h, but is on its pref list
        // "r := first resident on h's prefernace list not assigned to h",
        this.update(3, { '%resident%': potentialProposee.name });

        // if proposee is assigned to a different hospital then un assign
        // if r is assigned to another hospital h
        this.update(4, { '%resident%': potentialProposee.name });

        if (potentialProposee.match[0] != null) {
          this.breakAssignment(potentialProposee, potentialProposee.match[0]);
        }

        // provisionally assign r to h
        this.provisionallyAssign(potentialProposee, currentHospital);
        this.update(6, {
          '%resident%': potentialProposee.name,
          '%hospital%': currentHospital.name,
        });

        this.removeRuledOutPreferences(potentialProposee, currentHospital);

        this.freeAgentsOfGroup2 = this.checkFreeHospitals();

        // continous loop as guessed + not clear way to define/get free hospitals
        // rankings should be deleted until convergence?

        this.freeAgentsOfGroup1.shift();
      }
    }

    // stable matching found
    this.update(9);
    return;
  }
}

// MAY PRODUCE UNSTABLE MATCHINGS DUE TO BLOCKING PAIRS - CHECKED BY WEBAPP
// OTHER ISSUES - SOME HOSPITALS/RESIDENTS ARE NOT MACTHED DUE To TAKEN BY OTHER HOSPITALS
// AND THEIR PREFERANCE LIST BEING EMPTYED BY PREVOUIS STEPS

// NEEDS RESEARCJ TO FIX - I THINK I PRODUCES
