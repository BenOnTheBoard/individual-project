import { Agent } from '../interfaces/Agent';
import { AlgorithmData } from '../interfaces/AlgorithmData';
import { StepBuilder } from '../interfaces/Step';
import { UtilsService } from 'src/app/utils/utils.service';
import { ColourHexService } from '../../utils/colour-hex.service';
import { inject } from '@angular/core';

export abstract class MatchingAlgorithm {
  abstract group1Name: string;
  abstract group2Name: string;

  numberOfAgents: number;
  numberOfGroup2Agents: number;

  freeAgents: Array<String>;

  group1Agents: Map<String, Agent> = new Map();
  group2Agents: Map<String, Agent> = new Map();

  algorithmData: AlgorithmData = {
    commands: new Array(),
    descriptions: new Array(),
  };

  SRstable: boolean = true;

  currentLine: Array<string> = [];

  originalPrefsGroup1: Map<String, Array<String>> = new Map();
  originalPrefsGroup2: Map<String, Array<String>> = new Map();

  currentPrefsGroup1: Map<String, Array<String>> = new Map();
  currentPrefsGroup2: Map<String, Array<String>> = new Map();
  currentlySelectedAgents: Array<string> = [];
  currentLines: Array<Array<string>> = [];

  algorithmSpecificData: Object = {};

  relevantPreferences: Array<string> = [];

  stable: boolean = false;

  protected utils = inject(UtilsService);
  protected colourHexService = inject(ColourHexService);

  initialise(
    numberOfAgents: number,
    numberOfGroup2Agents: number = numberOfAgents,
  ) {
    this.freeAgents = [];

    this.group1Agents = new Map();
    this.group2Agents = new Map();

    this.algorithmData = {
      commands: new Array(),
      descriptions: new Array(),
    };

    this.currentLine = [];

    this.currentPrefsGroup1 = new Map();
    this.currentPrefsGroup2 = new Map();
    this.currentlySelectedAgents = [];
    this.currentLines = [];
    this.algorithmSpecificData = {};
    this.relevantPreferences = [];

    this.numberOfAgents = numberOfAgents;
    this.numberOfGroup2Agents = numberOfGroup2Agents;
    this.stable = false;
  }

  createAgent(name: string, agentsMap: Map<String, Agent>): void {
    agentsMap.set(name, { name, match: new Array(), ranking: new Array() });
  }

  generateAgents() {
    for (let i = 0; i < this.numberOfAgents; i++) {
      const name = this.group1Name + (i + 1);
      this.createAgent(name, this.group1Agents);
      this.freeAgents.push(name);
    }

    for (let i = 0; i < this.numberOfGroup2Agents; i++) {
      const currentLetter = String.fromCharCode(65 + i);
      const name = this.group2Name + currentLetter;
      this.createAgent(name, this.group2Agents);
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
      .freeAgents([...this.freeAgents])
      .matches(new Map())
      .stepVariables(stepVariables)
      .group1Prefs(structuredClone(this.currentPrefsGroup1))
      .group2Prefs(structuredClone(this.currentPrefsGroup2))
      .selectedAgents(structuredClone(this.currentlySelectedAgents))
      .currentLines(structuredClone(this.currentLines))
      .algorithmData(structuredClone(this.algorithmSpecificData))
      .relevantPrefs(structuredClone(this.relevantPreferences))
      .build();
    this.algorithmData.commands.push(currentStep);
  }

  getMatches(): Map<String, Array<String>> {
    return new Map(
      Array.from(this.group2Agents.values()).map((agent) => [
        agent.name,
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
    const prefs =
      group == 'group1' ? this.originalPrefsGroup1 : this.originalPrefsGroup2;
    const currentChar = this.utils.getLastChar(currentAgent.name);
    const targetChar = this.utils.getLastChar(agentToFind.name);
    const originalPrefs = prefs.get(currentChar);
    return originalPrefs.indexOf(targetChar);
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
    style: string,
  ) {
    const currentAgent = preferenceList.get(person)[position].includes('#')
      ? preferenceList
          .get(person)
          [position].charAt(preferenceList.get(person)[position].length - 2)
      : preferenceList
          .get(person)
          [position].charAt(preferenceList.get(person)[position].length - 1);

    const colour = this.colourHexService.getHex(style);
    preferenceList.get(person)[position] = `{${colour}${currentAgent}}`;
  }

  isBlockingPair(currentAgent: Agent, targetAgent: Agent): boolean {
    const match = targetAgent.match[0];
    const matchRank = this.getOriginalRank(targetAgent, match, 'group1');
    const curRank = this.getOriginalRank(targetAgent, currentAgent, 'group1');
    return curRank < matchRank;
  }

  checkStability(allMatches: Map<String, Array<String>>): boolean {
    for (const g2Name of allMatches.keys()) {
      const agentMatches = allMatches.get(g2Name);
      if (agentMatches.length == 0) continue;

      const lastAgentPosition = this.getLastMatch(g2Name, agentMatches);
      const g2Agent = this.group2Agents.get(g2Name);

      for (const g1Agent of g2Agent.ranking.slice(0, lastAgentPosition)) {
        if (agentMatches.includes(g1Agent.name)) continue;
        if (this.isBlockingPair(g1Agent, g2Agent)) return false;
      }
    }
    return true;
  }

  getLastMatch(currentAgent: String, agentMatches: Array<String>): number {
    let furthestIndex = 0;
    for (const matchAgent of agentMatches) {
      const matchPosition = this.getRank(
        this.group2Agents.get(currentAgent),
        this.group1Agents.get(matchAgent),
      );
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

    this.stable = this.checkStability(this.getMatches());

    if (!this.stable) return undefined;
    return this.algorithmData;
  }
}
