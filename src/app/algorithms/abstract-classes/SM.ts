import { AgentFactory, Man, Woman } from '../interfaces/Agents';
import { AlgorithmData } from '../interfaces/AlgorithmData';
import { MatchingAlgorithm } from './MatchingAlgorithm';

export abstract class SM extends MatchingAlgorithm {
  group1Name = 'man';
  group2Name = 'woman';
  freeAgents: Array<Man>;
  group1Agents: Map<String, Man> = new Map();
  group2Agents: Map<String, Woman> = new Map();

  protected packageStepVars(man?: Man, woman?: Woman, match?: Man): Object {
    const placeholderValues = new Object();
    if (man) placeholderValues['%man%'] = man.name;
    if (woman) placeholderValues['%woman%'] = woman.name;
    if (match) placeholderValues['%match%'] = match.name;
    return placeholderValues;
  }

  generateAgents(): void {
    for (let i = 0; i < this.numberOfAgents; i++) {
      const name = this.group1Name + (i + 1);
      const agent = AgentFactory.createMan(name);
      this.group1Agents.set(name, agent);
      this.freeAgents.push(agent);
    }

    for (let i = 0; i < this.numberOfGroup2Agents; i++) {
      const currentLetter = String.fromCharCode(65 + i);
      const name = this.group2Name + currentLetter;
      const agent = AgentFactory.createWoman(name);
      this.group2Agents.set(name, agent);
    }
  }

  abstract match(): AlgorithmData;
}
