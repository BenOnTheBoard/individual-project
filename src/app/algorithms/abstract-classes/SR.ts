import { AgentFactory, Person } from '../interfaces/Agents';
import { AlgorithmData } from '../interfaces/AlgorithmData';
import { MatchingAlgorithm } from './MatchingAlgorithm';

export abstract class SR extends MatchingAlgorithm {
  group1Name = 'person';
  group2Name = 'Other';

  group1Agents: Map<String, Person> = new Map();

  readonly #unstable4 = [
    ['2', '3', '4'],
    ['3', '1', '4'],
    ['1', '2', '4'],
    ['1', '2', '3'],
  ];

  readonly #unstable6_1 = [
    ['4', '6', '5', '2', '3'],
    ['5', '4', '3', '6', '1'],
    ['4', '5', '2', '1', '6'],
    ['5', '3', '1', '6', '2'],
    ['6', '2', '1', '4', '3'],
    ['3', '2', '4', '5', '1'],
  ];

  readonly #unstable6_2 = [
    ['5', '4', '3', '2', '6'],
    ['3', '5', '6', '1', '4'],
    ['5', '1', '4', '6', '2'],
    ['3', '2', '1', '6', '5'],
    ['2', '3', '6', '4', '1'],
    ['5', '1', '2', '4', '3'],
  ];

  readonly #unstable6_3 = [
    ['5', '2', '6', '4', '3'],
    ['4', '1', '6', '3', '5'],
    ['5', '2', '6', '1', '4'],
    ['5', '2', '6', '1', '3'],
    ['6', '4', '1', '2', '3'],
    ['1', '5', '4', '2', '3'],
  ];

  readonly #unstable8_1 = [
    ['3', '8', '7', '4', '5', '6', '2'],
    ['5', '3', '4', '1', '6', '7', '8'],
    ['8', '6', '2', '7', '1', '4', '5'],
    ['2', '1', '5', '7', '8', '6', '3'],
    ['4', '1', '7', '2', '6', '8', '3'],
    ['8', '1', '2', '4', '3', '5', '7'],
    ['3', '6', '8', '4', '2', '1', '5'],
    ['7', '1', '5', '4', '6', '3', '2'],
  ];

  readonly #unstable8_2 = [
    ['2', '7', '4', '5', '3', '6', '8'],
    ['1', '4', '5', '7', '3', '8', '6'],
    ['1', '7', '8', '5', '2', '6', '4'],
    ['8', '5', '1', '6', '7', '3', '2'],
    ['2', '6', '1', '8', '4', '3', '7'],
    ['5', '3', '2', '7', '1', '4', '8'],
    ['5', '2', '8', '6', '3', '4', '1'],
    ['3', '1', '7', '5', '6', '4', '2'],
  ];

  readonly #unstable8_3 = [
    ['7', '6', '5', '3', '4', '2', '8'],
    ['5', '6', '4', '1', '8', '3', '7'],
    ['2', '7', '8', '6', '5', '1', '4'],
    ['8', '3', '6', '2', '5', '7', '1'],
    ['1', '7', '3', '8', '6', '2', '4'],
    ['1', '2', '8', '5', '7', '4', '3'],
    ['1', '2', '8', '6', '5', '3', '4'],
    ['7', '2', '3', '1', '5', '4', '6'],
  ];

  readonly #nonStableSRInstances6 = [
    this.#unstable6_1,
    this.#unstable6_2,
    this.#unstable6_3,
  ];
  readonly #nonStableSRInstances8 = [
    this.#unstable8_1,
    this.#unstable8_2,
    this.#unstable8_3,
  ];

  selectUnstableInstance(): Array<Array<string>> {
    let random = 0;
    switch (this.numberOfAgents) {
      case 4:
        return this.#unstable4;
      case 6:
        random = Math.floor(Math.random() * this.#nonStableSRInstances6.length);
        return this.#nonStableSRInstances6[random];
      case 8:
        random = Math.floor(Math.random() * this.#nonStableSRInstances8.length);
        return this.#nonStableSRInstances8[random];
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

    // we need these to call getMatches
    for (let i = 0; i < this.numberOfGroup2Agents; i++) {
      const letter = String.fromCharCode(65 + i);
      const name = this.group2Name + letter;
      const agent = AgentFactory.createPerson(name);
      this.group2Agents.set(name, agent);
    }

    this.algorithmSpecificData['SR'] = true;
  }

  generatePrefs(): void {
    let count = 0;
    let instance = [];

    if (this.numberOfAgents == 2) {
      this.SRstable = true;
    }

    if (this.SRstable) {
      for (const agent of Array.from(this.group1Agents.values())) {
        const agent1Rankings = Array.from(new Map(this.group1Agents).values());
        const selfRank = agent1Rankings.indexOf(agent);
        agent1Rankings.splice(selfRank, 1);

        this.utils.shuffle(agent1Rankings);
        this.group1Agents.get(agent.name).ranking = agent1Rankings;
      }
    } else {
      instance = this.selectUnstableInstance();
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

      const personRanking = this.originalPrefsGroup1.get(
        this.utils.getAsChar(person),
      );
      for (const otherName of personRanking) {
        const other = this.group1Agents.get(this.group1Name + otherName);
        if (this.isBlockingPair(person, other)) return false;
      }
    }
    return true;
  }

  abstract match(): AlgorithmData;
}
