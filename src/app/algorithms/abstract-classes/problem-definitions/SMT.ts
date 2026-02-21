import { AgentFactory, TiedMan, TiedWoman } from '../../interfaces/Agents';
import { AlgorithmData } from '../../interfaces/AlgorithmData';
import { TiedMatchingAlgorithm } from '../TiedMatchingAlgorithm';

export abstract class SMT extends TiedMatchingAlgorithm {
  group1Name = 'man';
  group2Name = 'woman';
  freeAgents: Array<TiedMan>;
  group1Agents: Map<String, TiedMan> = new Map();
  group2Agents: Map<String, TiedWoman> = new Map();

  // We assume that all lists are complete
  // i.e. an agent always prefers to be matched over not.
  isBlockingPair(man: TiedMan, woman: TiedWoman): boolean {
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
      for (const tie of woman.ranking) {
        for (const man of tie) {
          if (woman.match.includes(man)) continue;
          if (this.isBlockingPair(man, woman)) return false;
        }
      }
    }
    return true;
  }

  generateAgents(): void {
    for (let i = 0; i < this.numberOfAgents; i++) {
      const name = this.group1Name + (i + 1);
      const agent = AgentFactory.createTiedMan(name);
      this.group1Agents.set(name, agent);
      this.freeAgents.push(agent);
    }

    for (let i = 0; i < this.numberOfG2Agents; i++) {
      const currentLetter = String.fromCharCode(65 + i);
      const name = this.group2Name + currentLetter;
      const agent = AgentFactory.createTiedWoman(name);
      this.group2Agents.set(name, agent);
    }
  }

  generatePrefs(): void {
    this.generateRandomRankings(this.group1Agents, this.group2Agents);
    this.generateRandomRankings(this.group2Agents, this.group1Agents);
  }

  abstract match(): AlgorithmData;
}
