import { Injectable } from '@angular/core';
import { ExtendedGaleShapley } from '../../abstract-classes/ExtendedGaleShapley';
import { Agent } from '../../interfaces/Agent';
import { Hospital } from '../../interfaces/Hospital';

const availableSpaces = 2; //this.getRandomInt(1, this.numberOfAgents-2);

@Injectable({
  providedIn: 'root',
})
export class HrResidentEgsService extends ExtendedGaleShapley {
  group1Name = 'resident';
  group2Name = 'hospital';

  group2Agents: Map<String, Hospital> = new Map();

  hospitalCapacity: Map<string, number> = new Map();

  generateAgents() {
    for (let i = 1; i < this.numberOfAgents + 1; i++) {
      const group1AgentName = this.group1Name + i;
      const agent = {
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

      this.group2Agents.set(group2AgentName, {
        name: group2AgentName,
        match: new Array(),
        ranking: new Array(),
        availableSpaces,
      });

      this.hospitalCapacity[currentLetter] = availableSpaces;
    }
    this.algorithmSpecificData['hospitalCapacity'] = this.hospitalCapacity;
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
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

  getNextProposee(hospital: Hospital): Agent {
    // return first hospital on r's list
    return hospital.ranking[0];
  }

  breakAssignment(resident: Agent, hospital: Hospital): void {
    this.saveStep(4, {
      '%hospital%': hospital.name,
      '%capacity%': hospital.availableSpaces,
      '%resident%': resident.name,
    });
    if (hospital.match.length < hospital.availableSpaces) return;

    const worstResident = this.getWorstResident(hospital);
    this.saveStep(5, {
      '%hospital%': hospital.name,
      '%worstResident%': worstResident.name,
    });

    const matchPosition = this.getRank(hospital, worstResident);

    this.removeLine(worstResident, hospital, 'green');
    this.changePrefsStyle('group1', worstResident, hospital, 'grey');
    this.changePrefsStyleByIndex('group2', hospital, matchPosition, 'grey');

    this.freeAgents.push(worstResident);

    hospital.match.splice(
      hospital.match.findIndex(
        (agent: { name: string }) => agent.name == worstResident.name,
      ),
      1,
    );
    hospital.ranking.splice(matchPosition, 1);

    worstResident.match.splice(0, 1);
    worstResident.ranking.splice(this.getRank(worstResident, hospital), 1);

    const hospitalChar = this.utils.getAsChar(hospital);
    const currentHospitalCapacity: string =
      this.algorithmSpecificData['hospitalCapacity'][hospitalChar];

    this.algorithmSpecificData['hospitalCapacity'][hospitalChar] = String(
      currentHospitalCapacity,
    ).charAt(currentHospitalCapacity.length - 2);

    this.saveStep(6, {
      '%hospital%': hospital.name,
      '%worstResident%': worstResident.name,
    });
  }

  provisionallyAssign(resident: Agent, hospital: Hospital) {
    // provisionally assign r to h;
    const proposeeChar = this.utils.getAsChar(hospital);

    this.changeLineColour(resident, hospital, 'red', 'green');
    this.changePrefsStyle('group1', resident, hospital, 'green');
    this.changePrefsStyleByIndex(
      'group2',
      hospital,
      this.getRank(hospital, resident),
      'green',
    );

    if (hospital.match.length >= hospital.availableSpaces - 1) {
      const colourHex = this.colourHexService.getHex('green');
      this.algorithmSpecificData['hospitalCapacity'][proposeeChar] =
        `{${colourHex}${this.algorithmSpecificData['hospitalCapacity'][proposeeChar]}}`;
    }

    this.saveStep(7, {
      '%resident%': resident.name,
      '%hospital%': hospital.name,
    });
    resident.match[0] = hospital;
    hospital.match.push(resident);
  }

  removeRuledOutPrefs(resident: Agent, hospital: Hospital): void {
    this.saveStep(8, {
      '%resident%': resident.name,
      '%hospital%': hospital.name,
    });

    if (hospital.match.length < hospital.availableSpaces) return;

    const worstResident: Agent = this.getWorstResident(hospital);
    const worstResidentPosition: number = this.getRank(hospital, worstResident);

    this.saveStep(9, {
      '%hospital%': hospital.name,
      '%worstResident%': worstResident.name,
    });

    let hospitalRankingClearCounter: number = worstResidentPosition + 1;

    // for each successor h' of h on r's list {
    for (let i = worstResidentPosition + 1; i < hospital.ranking.length; i++) {
      const hospitalPosition: number = this.getRank(
        hospital.ranking[i],
        hospital,
      );
      this.relevantPrefs.push(this.utils.getAsChar(hospital.ranking[i]));

      this.saveStep(10, {
        '%hospital%': hospital.name,
        '%nextResident%': hospital.ranking[i].name,
      });

      this.changePrefsStyle('group1', hospital.ranking[i], hospital, 'grey');
      this.changePrefsStyleByIndex(
        'group2',
        hospital,
        hospitalRankingClearCounter,
        'grey',
      );
      hospital.ranking[i].ranking.splice(hospitalPosition, 1);

      // remove h' and r from each other's lists
      this.saveStep(11, {
        '%hospital%': hospital.name,
        '%nextResident%': hospital.ranking[i].name,
      });

      hospital.ranking.splice(i, 1);
      i--;

      hospitalRankingClearCounter++;

      this.relevantPrefs.pop();
    }
  }
}
