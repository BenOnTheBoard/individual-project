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

  abstract match(): AlgorithmData;
}
