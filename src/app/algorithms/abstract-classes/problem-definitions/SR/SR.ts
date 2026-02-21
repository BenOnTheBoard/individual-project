import { AgentFactory, Person } from '../../../interfaces/Agents';
import { AlgorithmData } from '../../../interfaces/AlgorithmData';
import {
  unstable4,
  unstableInstances6,
  unstableInstances8,
} from './SRUnstableInstances';
import { UntiedMatchingAlgorithm } from '../../UntiedMatchingAlgorithm';

export abstract class SR extends UntiedMatchingAlgorithm {
  group1Name = 'person';
  group2Name = 'Other';

  freeAgents: Array<Person> = [];
  group1Agents: Map<String, Person> = new Map();

  selectUnstableInstance(): Array<Array<string>> {
    switch (this.numberOfAgents) {
      case 4:
        return unstable4;
      case 6:
        return this.utils.selectRandomElement(unstableInstances6);
      case 8:
        return this.utils.selectRandomElement(unstableInstances8);
      default:
        throw new RangeError(
          'selectUnstableInstance called while number of agents is not in {4,6,8}',
        );
    }
  }

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
    if (this.numberOfAgents == 2) {
      this.SRstable = true;
    }

    if (this.SRstable) {
      this.generateRandomRankings(this.group1Agents, this.group1Agents);
      for (const agent of Array.from(this.group1Agents.values())) {
        const selfRank = agent.ranking.indexOf(agent);
        agent.ranking.splice(selfRank, 1);
      }
    } else {
      let count = 0;
      const instance = this.selectUnstableInstance();
      for (const person of this.group1Agents.values()) {
        for (let i = 0; i < this.group1Agents.size - 1; i++) {
          person.ranking[i] = this.group1Agents.get(
            this.group1Name + String(instance[count][i]),
          );
        }
        count++;
      }
    }
  }

  isBlockingPair(person: Person, other: Person): boolean {
    const personBlock = this.getOriginalRank(person, other, 'group1');
    const personCur = this.getOriginalRank(
      person,
      person.lastProposed,
      'group1',
    );
    const otherBlock = this.getOriginalRank(other, person, 'group1');
    const otherCur = this.getOriginalRank(other, other.lastProposed, 'group1');
    return personBlock < personCur && otherBlock < otherCur;
  }

  checkStability(): boolean {
    for (const person of this.group1Agents.values()) {
      if (!person.lastProposed) continue; // if agent has no matches

      const personRanking = this.origPrefsGroup1.get(person.name);
      for (const otherName of personRanking) {
        const other = this.group1Agents.get(otherName);
        if (this.isBlockingPair(person, other)) return false;
      }
    }
    return true;
  }

  abstract match(): AlgorithmData;
}
