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

  // We assume that all lists are complete
  // i.e. an agent always prefers to be matched over not.
  isBlockingPair(man: Man, woman: Woman): boolean {
    let manBlocks = true;
    let womanBlocks = true;
    if (man.match.length > 0) {
      const manBlock = this.getOriginalRank(man, woman, 'group1');
      const manMatch = this.getOriginalRank(man, man.match[0], 'group1');
      manBlocks = manBlock < manMatch;
    }
    if (woman.match.length > 0) {
      const womanBlock = this.getOriginalRank(woman, man, 'group2');
      const womanMatch = this.getOriginalRank(woman, woman.match[0], 'group2');
      womanBlocks = womanBlock < womanMatch;
    }
    return manBlocks && womanBlocks;
  }

  checkStability(): boolean {
    for (const woman of this.group2Agents.values()) {
      for (const man of woman.ranking) {
        if (woman.match.includes(man)) continue;
        if (this.isBlockingPair(man, woman)) return false;
      }
    }
    return true;
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

  generatePrefs(): void {
    this.shuffleRankings(this.group1Agents, this.group2Agents);
    this.shuffleRankings(this.group2Agents, this.group1Agents);
  }

  abstract match(): AlgorithmData;
}
