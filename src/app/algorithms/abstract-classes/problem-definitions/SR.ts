import { AgentFactory, Person } from '../../interfaces/Agents';
import { UntiedMatchingAlgorithm } from '../UntiedMatchingAlgorithm';

export abstract class SR extends UntiedMatchingAlgorithm {
  group1Name = 'person';
  group2Name = 'Other';

  freeAgents: Array<Person> = [];
  group1Agents: Map<String, Person> = new Map();

  generateAgents(): void {
    for (let i = 1; i < this.numberOfAgents + 1; i++) {
      const name = this.group1Name + i;
      const agent = AgentFactory.createPerson(name);
      this.group1Agents.set(name, agent);
      this.freeAgents.push(agent);
    }
    this.algorithmSpecificData['SR'] = true;
  }

  generatePrefs(): void {
    this.generateRandomRankings(this.group1Agents, this.group1Agents);
    for (const agent of Array.from(this.group1Agents.values())) {
      const selfRank = agent.ranking.indexOf(agent);
      agent.ranking.splice(selfRank, 1);
    }
  }

  isBlockingPair(person: Person, other: Person): boolean {
    let personBlocks = true;
    let otherBlocks = true;
    if (person.lastProposed) {
      const match = person.lastProposed;
      const personBlock = this.getOriginalRank(person, other, 'group1');
      const personCur = this.getOriginalRank(person, match, 'group1');
      personBlocks = personBlock < personCur;
    }
    if (other.lastProposed) {
      const match = other.lastProposed;
      const otherBlock = this.getOriginalRank(other, person, 'group1');
      const otherCur = this.getOriginalRank(other, match, 'group1');
      otherBlocks = otherBlock < otherCur;
    }
    return personBlocks && otherBlocks;
  }

  checkStability(): boolean {
    for (const person of this.group1Agents.values()) {
      if (!person.lastProposed) return false; // if agent has no matches

      const personRanking = this.origPrefsG1.get(person.name);
      for (const otherName of personRanking) {
        const other = this.group1Agents.get(otherName);
        if (this.isBlockingPair(person, other)) return false;
      }
    }
    return true;
  }

  abstract match(): void;
}
