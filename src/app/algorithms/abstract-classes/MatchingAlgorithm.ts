import { Agent } from '../interfaces/Agents';
import { AlgorithmData } from '../interfaces/AlgorithmData';
import { StepBuilder } from '../interfaces/Step';
import { UtilsService } from 'src/app/utils/utils.service';
import { ColourHexService } from '../../utils/colour-hex.service';
import { inject } from '@angular/core';

export abstract class MatchingAlgorithm {
  protected abstract group1Name: string;
  protected abstract group2Name: string;

  protected abstract freeAgents: Array<Agent>;
  protected abstract group1Agents: Map<String, Agent>;
  protected group2Agents: Map<String, Agent>;

  protected numberOfAgents: number;
  protected numberOfGroup2Agents: number;

  protected originalPrefsGroup1: Map<String, Array<String>>;
  protected originalPrefsGroup2: Map<String, Array<String>>;
  protected currentPrefsGroup1: Map<String, Array<String>>;
  protected currentPrefsGroup2: Map<String, Array<String>>;

  protected selectedAgents: Array<string>;
  protected currentLines: Array<Array<string>>;
  protected algorithmSpecificData: Object;
  protected relevantPrefs: Array<string>;

  protected SRstable: boolean = true;
  #stable: boolean = false;
  #algorithmRunData: AlgorithmData;

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

  isStable() {
    return this.#stable;
  }

  // --- Presentation Helper Functions ---

  createLine(from: Agent, to: Agent, colour: string): [string, string, string] {
    return [this.utils.getAsChar(from), this.utils.getAsChar(to), colour];
  }

  addLine(from: Agent, to: Agent, colour: string): void {
    this.currentLines.push(this.createLine(from, to, colour));
  }

  removeLine(from: Agent, to: Agent, colour: string): void {
    const line = this.createLine(from, to, colour);
    this.currentLines = this.removeSubArray(this.currentLines, line);
  }

  changeLineColour(
    from: Agent,
    to: Agent,
    oldColour: string,
    newColour: string,
  ): void {
    this.removeLine(from, to, oldColour);
    this.addLine(from, to, newColour);
  }

  stylePrefs(
    group: 'group1' | 'group2',
    agent: Agent,
    target: Agent,
    colour: string,
  ): void {
    const idx = this.getOriginalRank(agent, target, group);
    const prefLists =
      group == 'group1' ? this.currentPrefsGroup1 : this.currentPrefsGroup2;
    const agentChar = this.utils.getAsChar(agent);
    const prefs = prefLists.get(agentChar);
    const currentToken = prefs[idx];
    const nameIdx = currentToken.includes('#')
      ? currentToken.length - 2 // there's an extra closing bracket
      : currentToken.length - 1;
    const currentAgent = currentToken.charAt(nameIdx);
    const colourHex = this.colourHexService.getHex(colour);
    prefs[idx] = `{${colourHex}${currentAgent}}`;
  }

  stylePrefsMutual(g1Agent: Agent, g2Agent: Agent, colour: string): void {
    this.stylePrefs('group1', g1Agent, g2Agent, colour);
    this.stylePrefs('group2', g2Agent, g1Agent, colour);
  }

  saveStep(step: number, stepVariables?: Object): void {
    const currentStep = new StepBuilder()
      .lineNumber(step)
      .freeAgents(structuredClone(this.freeAgents))
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

  // --- Ranking Helper Functions ---

  generateRandomRankings(
    rankers: Map<String, Agent>,
    targets: Map<String, Agent>,
  ): void {
    for (const agent of Array.from(rankers.values())) {
      const shuffledTargets = Array.from(targets.values());
      this.utils.shuffle(shuffledTargets);
      agent.ranking = shuffledTargets;
    }
  }

  getRankings(agentMap: Map<String, Agent>): Map<String, Array<String>> {
    return new Map(
      Array.from(agentMap.values()).map((agent) => [
        this.utils.getAsChar(agent),
        agent.ranking.map((m) => this.utils.getAsChar(m)),
      ]),
    );
  }

  getRank(agent: Agent, target: Agent): number {
    return agent.ranking.findIndex(
      (candidate) => candidate.name == target.name,
    );
  }

  getOriginalRank(
    currentAgent: Agent,
    agentToFind: Agent,
    group: 'group1' | 'group2',
  ): number {
    const originalPrefs =
      group == 'group1' ? this.originalPrefsGroup1 : this.originalPrefsGroup2;
    const currentChar = this.utils.getAsChar(currentAgent);
    const targetChar = this.utils.getAsChar(agentToFind);
    return originalPrefs.get(currentChar).indexOf(targetChar);
  }

  // --- Other Helper Functions ---

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

  // ---

  abstract checkStability(): boolean;
  abstract generateAgents(): void;
  abstract generatePrefs(): void;
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

    if (this.group2Agents) {
      this.currentPrefsGroup2 = this.getRankings(this.group2Agents);
      this.originalPrefsGroup2 = structuredClone(this.currentPrefsGroup2);
    }

    this.match();

    this.#stable = this.checkStability();

    if (!this.#stable) return undefined;
    return this.#algorithmRunData;
  }
}
