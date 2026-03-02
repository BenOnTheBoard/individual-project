import {
  AgentFactory,
  TiedHospital,
  TiedResident,
} from '../../interfaces/Agents';
import { TiedMatchingAlgorithm } from '../TiedMatchingAlgorithm';

export abstract class HRT extends TiedMatchingAlgorithm {
  group1Name = 'resident';
  group2Name = 'hospital';
  group1Agents: Map<String, TiedResident> = new Map();
  group2Agents: Map<String, TiedHospital> = new Map();
  hospitalCapacity: Map<string, string> = new Map();

  packageStepVars(resident?: TiedResident, hospital?: TiedHospital) {
    const placeholderValues = new Object();
    if (resident) placeholderValues['%resident%'] = resident.name;
    if (hospital) {
      placeholderValues['%hospital%'] = hospital.name;
      placeholderValues['%capacity%'] = hospital.capacity;
    }
    return placeholderValues;
  }

  setCapacityStyle(hospital: TiedHospital, colour: string) {
    const char = this.utils.getAsChar(hospital);
    const hex = this.colourHexService.getHex(colour);
    this.hospitalCapacity.set(char, `{${hex}${String(hospital.capacity)}}`);
  }

  // We assume that all lists are complete
  // i.e. an agent always prefers to be matched over not, full over not
  isBlockingPair(res: TiedResident, hos: TiedHospital): boolean {
    let resBlocks = true;
    let hosBlocks = true;
    if (res.match.length > 0) {
      const resBlock = this.getOriginalRank(res, hos, 'group1');
      const resMatch = this.getOriginalRank(res, res.match[0], 'group1');
      resBlocks = resBlock <= resMatch;
    }
    if (hos.match.length >= hos.capacity) {
      const worstRes = this.getWorstResident(hos);
      const hosBlock = this.getOriginalRank(hos, res, 'group2');
      const hosWorst = this.getOriginalRank(hos, worstRes, 'group2');
      hosBlocks = hosBlock <= hosWorst;
    }
    return resBlocks && hosBlocks;
  }

  checkStability(): boolean {
    for (const hos of this.group2Agents.values()) {
      for (const tie of hos.ranking) {
        for (const res of tie) {
          if (hos.match.includes(res)) continue;
          if (this.isBlockingPair(res, hos)) return false;
        }
      }
    }
    return true;
  }

  generateAgents(): void {
    for (let i = 1; i < this.numberOfAgents + 1; i++) {
      const name = this.group1Name + i;
      const agent = AgentFactory.createTiedResident(name);
      this.group1Agents.set(name, agent);
      this.freeAgents.push(agent);
    }

    for (let i = 0; i < this.numberOfG2Agents; i++) {
      const letter = String.fromCharCode(65 + i);
      const name = this.group2Name + letter;
      const capacity = this.utils.getRandomInt(2, this.numberOfAgents / 2);
      const agent = AgentFactory.createTiedHospital(name, capacity);

      this.group2Agents.set(name, agent);
      this.setCapacityStyle(agent, 'black');
    }
    this.algorithmSpecificData['hospitalCapacity'] = this.hospitalCapacity;
  }

  getWorstResident(hos: TiedHospital): TiedResident {
    const rankFunc = (res: TiedResident) => this.getRank(hos, res);
    return this.utils.argMax(hos.match, rankFunc);
  }

  provisionallyAssign(resident: TiedResident, hospital: TiedHospital) {
    resident.match.push(hospital);
    hospital.match.push(resident);
  }

  abstract match(): void;
}
