import { AbstractAgent, Agent, Group } from '../interfaces/Agents';
import { AlgorithmData } from '../interfaces/AlgorithmData';
import { StepBuilder } from '../interfaces/Step';
import { UtilsService } from 'src/app/utils/utils.service';
import { ColourHexService } from '../../utils/colour-hex.service';
import { inject } from '@angular/core';

export abstract class MatchingAlgorithm {
  protected abstract group1Name: string;
  protected abstract group2Name: string;

  protected abstract freeAgents: Array<Agent>;
  protected abstract group1Agents: Map<String, any>;
  protected abstract group2Agents: Map<String, any>;

  protected numberOfAgents: number;
  protected numberOfGroup2Agents: number;

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

  createLine(
    from: AbstractAgent<any>,
    to: AbstractAgent<any>,
    colour: string,
  ): [string, string, string] {
    return [this.utils.getAsChar(from), this.utils.getAsChar(to), colour];
  }

  addLine(
    from: AbstractAgent<any>,
    to: AbstractAgent<any>,
    colour: string,
  ): void {
    this.currentLines.push(this.createLine(from, to, colour));
  }

  removeLine(
    from: AbstractAgent<any>,
    to: AbstractAgent<any>,
    colour: string,
  ): void {
    const line = this.createLine(from, to, colour);
    this.currentLines = this.removeSubArray(this.currentLines, line);
  }

  changeLineColour(
    from: AbstractAgent<any>,
    to: AbstractAgent<any>,
    oldColour: string,
    newColour: string,
  ): void {
    this.removeLine(from, to, oldColour);
    this.addLine(from, to, newColour);
  }

  stylePrefsMutual(
    g1Agent: AbstractAgent<any>,
    g2Agent: AbstractAgent<any>,
    colour: string,
  ): void {
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
  abstract initCurrentAndOriginalPrefs(): void;

  abstract stylePrefs(
    group: Group,
    agent: AbstractAgent<any>,
    target: AbstractAgent<any>,
    colour: string,
  ): void;

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
    this.initCurrentAndOriginalPrefs();
    this.SRstable = SRstable;

    this.match();
    this.#stable = this.checkStability();

    if (!this.#stable) return undefined;
    return this.#algorithmRunData;
  }
}
