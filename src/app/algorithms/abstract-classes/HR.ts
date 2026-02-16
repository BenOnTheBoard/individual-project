import { AgentFactory, Hospital, Resident } from '../interfaces/Agents';
import { AlgorithmData } from '../interfaces/AlgorithmData';
import { MatchingAlgorithm } from './MatchingAlgorithm';

export abstract class HR extends MatchingAlgorithm {
  group1Name = 'resident';
  group2Name = 'hospital';
  group1Agents: Map<String, Resident> = new Map();
  group2Agents: Map<String, Hospital> = new Map();
  hospitalCapacity: Map<string, string> = new Map();

  generateAgents(): void {
    for (let i = 1; i < this.numberOfAgents + 1; i++) {
      const name = this.group1Name + i;
      const agent = AgentFactory.createResident(name);
      this.group1Agents.set(name, agent);
    }

    for (let i = 0; i < this.numberOfGroup2Agents; i++) {
      const letter = String.fromCharCode(65 + i);
      const name = this.group2Name + letter;
      const randomCap = this.utils.getRandomInt(0, this.numberOfAgents);
      const capacity = Math.max(2, randomCap);
      const agent = AgentFactory.createHospital(name, capacity);

      this.group2Agents.set(name, agent);
      this.hospitalCapacity.set(letter, String(capacity));
    }
    this.algorithmSpecificData['hospitalCapacity'] = this.hospitalCapacity;
  }

  getWorstResident(hospital: Hospital): Resident {
    const positionMap: Map<number, Resident> = new Map();
    for (const resident of hospital.match) {
      positionMap.set(this.getRank(hospital, resident), resident);
    }
    return positionMap.get(Math.max(...Array.from(positionMap.keys())));
  }

  assignmentBreakStyling(resident: Resident, hospital: Hospital): void {
    this.removeLine(resident, hospital, 'green');
    this.stylePrefsMutual(resident, hospital, 'grey');

    const hospitalChar = this.utils.getAsChar(hospital);
    const colourHex = this.colourHexService.getHex('black');
    this.hospitalCapacity.set(
      hospitalChar,
      `{${colourHex}${String(hospital.capacity)}}`,
    );
  }

  breakAssignment(resident: Resident, hospital: Hospital): void {
    const rankOfResident = this.getRank(hospital, resident);
    const rankOfHospital = this.getRank(resident, hospital);
    resident.match.splice(0, 1);
    hospital.match.splice(this.getRank(hospital, resident), 1);
    hospital.ranking.splice(rankOfResident, 1);
    resident.ranking.splice(rankOfHospital, 1);
  }

  provisionallyAssign(resident: Resident, hospital: Hospital) {
    // provisionally assign r to h;
    const proposeeChar = this.utils.getAsChar(hospital);

    this.changeLineColour(resident, hospital, 'red', 'green');
    this.stylePrefsMutual(resident, hospital, 'green');

    if (hospital.match.length >= hospital.capacity - 1) {
      const colourHex = this.colourHexService.getHex('green');
      this.hospitalCapacity.set(
        proposeeChar,
        `{${colourHex}${String(hospital.capacity)}}`,
      );
    }

    resident.match[0] = hospital;
    hospital.match.push(resident);
  }

  abstract match(): AlgorithmData;
}
