import { Agent } from '../interfaces/Agent';
import { AlgorithmData } from '../interfaces/AlgorithmData';
import { StepBuilder } from '../interfaces/Step';
import { UtilsService } from 'src/app/utils/utils.service';
import { ColourHexService } from '../../utils/colour-hex.service';
import { inject } from '@angular/core';

export abstract class MatchingAlgorithm {
  abstract group1Name: string;
  abstract group2Name: string;
  protected numberOfAgents: number;
  protected numberOfGroup2Agents: number;

  protected freeAgents: Array<Agent>;
  protected group1Agents: Map<String, Agent> = new Map();
  protected group2Agents: Map<String, Agent> = new Map();
  protected originalPrefsGroup1: Map<String, Array<String>> = new Map();
  protected originalPrefsGroup2: Map<String, Array<String>> = new Map();
  protected currentPrefsGroup1: Map<String, Array<String>> = new Map();
  protected currentPrefsGroup2: Map<String, Array<String>> = new Map();

  protected selectedAgents: Array<string> = [];
  protected currentLines: Array<Array<string>> = [];
  protected algorithmSpecificData: Object = {};
  protected relevantPrefs: Array<string> = [];

  protected SRstable: boolean = true;
  #stable: boolean = false;

  #algorithmRunData: AlgorithmData = {
    commands: new Array(),
    descriptions: new Array(),
  };

  protected utils = inject(UtilsService);
  protected colourHexService = inject(ColourHexService);

  initialise(
    numberOfAgents: number,
    numberOfGroup2Agents: number = numberOfAgents,
  ) {
    this.numberOfAgents = numberOfAgents;
    this.numberOfGroup2Agents = numberOfGroup2Agents;

    this.freeAgents = [];
    this.group1Agents = new Map();
    this.group2Agents = new Map();
    this.currentPrefsGroup1 = new Map();
    this.currentPrefsGroup2 = new Map();

    this.selectedAgents = [];
    this.currentLines = [];
    this.algorithmSpecificData = {};
    this.relevantPrefs = [];

    this.#stable = false;

    this.#algorithmRunData = {
      commands: new Array(),
      descriptions: new Array(),
    };
  }

  createAgent(name: string): Agent {
    return { name, match: new Array(), ranking: new Array() };
  }

  generateAgents() {
    for (let i = 0; i < this.numberOfAgents; i++) {
      const name = this.group1Name + (i + 1);
      const agent = this.createAgent(name);
      this.group1Agents.set(name, agent);
      this.freeAgents.push(agent);
    }

    for (let i = 0; i < this.numberOfGroup2Agents; i++) {
      const currentLetter = String.fromCharCode(65 + i);
      const name = this.group2Name + currentLetter;
      const agent = this.createAgent(name);
      this.group2Agents.set(name, agent);
    }
  }

  shuffleRankings(
    rankers: Map<String, Agent>,
    targets: Map<String, Agent>,
  ): void {
    for (const agent of Array.from(rankers.values())) {
      const shuffledTargets = Array.from(targets.values());
      this.utils.shuffle(shuffledTargets);
      agent.ranking = shuffledTargets;
    }
  }

  generatePrefs(): void {
    this.shuffleRankings(this.group1Agents, this.group2Agents);
    this.shuffleRankings(this.group2Agents, this.group1Agents);
  }

  getRankings(agentMap: Map<String, Agent>): Map<String, Array<String>> {
    return new Map(
      Array.from(agentMap.values()).map((agent) => [
        this.utils.getLastChar(agent.name),
        agent.ranking.map((m) => this.utils.getLastChar(m.name)),
      ]),
    );
  }

  saveStep(step: number, stepVariables?: Object): void {
    const currentStep = new StepBuilder()
      .lineNumber(step)
      .freeAgents(structuredClone(this.freeAgents))
      .matches(new Map())
      .stepVariables(stepVariables)
      .group1Prefs(structuredClone(this.currentPrefsGroup1))
      .group2Prefs(structuredClone(this.currentPrefsGroup2))
      .selectedAgents(structuredClone(this.selectedAgents))
      .currentLines(structuredClone(this.currentLines))
      .algorithmData(structuredClone(this.algorithmSpecificData))
      .relevantPrefs(structuredClone(this.relevantPrefs))
      .build();
    this.#algorithmRunData.commands.push(currentStep);
  }

  getMatches(): Map<Agent, Array<String>> {
    return new Map(
      Array.from(this.group2Agents.values()).map((agent) => [
        agent,
        agent.match.map((m) => m.name),
      ]),
    );
  }

  getRank(currentAgent: Agent, agentToFind: Agent): number {
    return currentAgent.ranking.findIndex(
      (agent) => agent.name == agentToFind.name,
    );
  }

  getOriginalRank(
    currentAgent: Agent,
    agentToFind: Agent,
    group: 'group1' | 'group2',
  ) {
    const originalPrefs =
      group == 'group1' ? this.originalPrefsGroup1 : this.originalPrefsGroup2;
    const currentChar = this.utils.getLastChar(currentAgent.name);
    const targetChar = this.utils.getLastChar(agentToFind.name);
    return originalPrefs.get(currentChar).indexOf(targetChar);
  }

  removeSubArray(
    a: Array<Array<string>>,
    b: Array<string>,
  ): Array<Array<string>> {
    return a.filter((subArray) => !this.utils.checkArrayEquality(subArray, b));
  }

  removePerson(a: Array<Array<string>>, person: string): Array<Array<string>> {
    return a.filter((subArray) => subArray[0] != person);
  }

  removeTarget(a: Array<Array<string>>, target: string): Array<Array<string>> {
    return a.filter((subArray) => subArray[1] != target);
  }

  changePrefsStyle(
    preferenceList: Map<String, Array<String>>,
    person: string,
    position: number,
    newColour: string,
  ) {
    const prefs = preferenceList.get(person);
    const currentToken = prefs[position];
    const nameIdx = currentToken.includes('#')
      ? currentToken.length - 2 // there's an extra closing bracket
      : currentToken.length - 1;
    const currentAgent = currentToken.charAt(nameIdx);
    const colour = this.colourHexService.getHex(newColour);
    prefs[position] = `{${colour}${currentAgent}}`;
  }

  isBlockingPair(currentAgent: Agent, targetAgent: Agent): boolean {
    const match = targetAgent.match[0];
    const matchRank = this.getOriginalRank(targetAgent, match, 'group1');
    const curRank = this.getOriginalRank(targetAgent, currentAgent, 'group1');
    return curRank < matchRank;
  }

  checkStability(allMatches: Map<Agent, Array<String>>): boolean {
    for (const g2Agent of allMatches.keys()) {
      const agentMatches = allMatches.get(g2Agent);
      if (agentMatches.length == 0) continue;

      const lastAgentPosition = this.getLastMatch(g2Agent, agentMatches);

      for (const g1Agent of g2Agent.ranking.slice(0, lastAgentPosition)) {
        if (agentMatches.includes(g1Agent.name)) continue;
        if (this.isBlockingPair(g2Agent, g1Agent)) return false;
      }
    }
    return true;
  }

  getLastMatch(currentAgent: Agent, agentMatches: Array<String>): number {
    let furthestIndex = 0;
    for (const matchName of agentMatches) {
      const matchAgent = this.group1Agents.get(matchName);
      const matchPosition = this.getRank(currentAgent, matchAgent);
      if (matchPosition > furthestIndex) {
        furthestIndex = matchPosition;
      }
    }
    return furthestIndex;
  }

  abstract match(): AlgorithmData;

  run(
    numberOfAgents: number,
    numberOfGroup2Agents: number = numberOfAgents,
    SRstable: boolean = true,
  ): AlgorithmData {
    this.initialise(numberOfAgents, numberOfGroup2Agents);
    this.generateAgents();
    this.generatePrefs();
    this.SRstable = SRstable;

    this.currentPrefsGroup1 = this.getRankings(this.group1Agents);
    this.originalPrefsGroup1 = structuredClone(this.currentPrefsGroup1);

    this.currentPrefsGroup2 = this.getRankings(this.group2Agents);
    this.originalPrefsGroup2 = structuredClone(this.currentPrefsGroup2);

    this.match();

    this.#stable = this.checkStability(this.getMatches());

    if (!this.#stable) return undefined;
    return this.#algorithmRunData;
  }
}
