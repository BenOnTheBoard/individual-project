import { AgentFactory, Hospital, Resident } from '../interfaces/Agents';
import { AlgorithmData } from '../interfaces/AlgorithmData';
import { UntiedMatchingAlgorithm } from './UntiedMatchingAlgorithm';

export abstract class HR extends UntiedMatchingAlgorithm {
  group1Name = 'resident';
  group2Name = 'hospital';
  group1Agents: Map<String, Resident> = new Map();
  group2Agents: Map<String, Hospital> = new Map();
  hospitalCapacity: Map<string, string> = new Map();

  packageStepVars(resident?: Resident, hospital?: Hospital) {
    const placeholderValues = new Object();
    if (resident) placeholderValues['%resident%'] = resident.name;
    if (hospital) {
      placeholderValues['%hospital%'] = hospital.name;
      placeholderValues['%capacity%'] = hospital.capacity;
    }
    return placeholderValues;
  }

  setCapacityStyle(hospital: Hospital, colour: string) {
    const char = this.utils.getAsChar(hospital);
    const hex = this.colourHexService.getHex(colour);
    this.hospitalCapacity.set(char, `{${hex}${String(hospital.capacity)}}`);
  }

  // We assume that all lists are complete
  // i.e. an agent always prefers to be matched over not, full over not
  isBlockingPair(res: Resident, hos: Hospital): boolean {
    let resBlocks = true;
    let hosBlocks = true;
    if (res.match.length > 0) {
      const resBlock = this.getOriginalRank(res, hos, 'group1');
      const resMatch = this.getOriginalRank(res, res.match[0], 'group1');
      resBlocks = resBlock < resMatch;
    }
    if (hos.match.length >= hos.capacity) {
      const worstRes = this.getWorstResident(hos);
      const hosBlock = this.getOriginalRank(hos, res, 'group2');
      const hosWorst = this.getOriginalRank(hos, worstRes, 'group2');
      hosBlocks = hosBlock < hosWorst;
    }
    return resBlocks && hosBlocks;
  }

  checkStability(): boolean {
    for (const hospital of this.group2Agents.values()) {
      for (const resident of hospital.ranking) {
        if (hospital.match.includes(resident)) continue;
        if (this.isBlockingPair(resident, hospital)) return false;
      }
    }
    return true;
  }

  generateAgents(): void {
    for (let i = 1; i < this.numberOfAgents + 1; i++) {
      const name = this.group1Name + i;
      const agent = AgentFactory.createResident(name);
      this.group1Agents.set(name, agent);
    }

    for (let i = 0; i < this.numberOfGroup2Agents; i++) {
      const letter = String.fromCharCode(65 + i);
      const name = this.group2Name + letter;
      const capacity = this.utils.getRandomInt(2, this.numberOfAgents / 2);
      const agent = AgentFactory.createHospital(name, capacity);

      this.group2Agents.set(name, agent);
      this.setCapacityStyle(agent, 'black');
    }
    this.algorithmSpecificData['hospitalCapacity'] = this.hospitalCapacity;
  }

  generatePrefs(): void {
    this.generateRandomRankings(this.group1Agents, this.group2Agents);
    this.generateRandomRankings(this.group2Agents, this.group1Agents);
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
    this.setCapacityStyle(hospital, 'black');
  }

  breakAssignment(resident: Resident, hospital: Hospital): void {
    this.assignmentBreakStyling(resident, hospital);
    const rankOfResident = this.getRank(hospital, resident);
    const rankOfHospital = this.getRank(resident, hospital);
    resident.match.splice(0, 1);
    hospital.match.splice(rankOfResident, 1);
    hospital.ranking.splice(rankOfResident, 1);
    resident.ranking.splice(rankOfHospital, 1);
  }

  provisionalAssignmentStyling(resident: Resident, hospital: Hospital) {
    this.changeLineColour(resident, hospital, 'red', 'green');
    this.stylePrefsMutual(resident, hospital, 'green');
    if (hospital.match.length >= hospital.capacity) {
      this.setCapacityStyle(hospital, 'green');
    }
  }

  provisionallyAssign(resident: Resident, hospital: Hospital) {
    resident.match[0] = hospital;
    hospital.match.push(resident);
  }

  abstract match(): AlgorithmData;
}
