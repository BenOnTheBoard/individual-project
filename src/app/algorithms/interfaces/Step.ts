import { Agent } from './Agents';

export interface Step {
  lineNumber: number;
  freeAgents: Array<Agent>;
  stepVariables: Object;
  currentPrefsGroup1: Map<String, Array<String>>;
  currentPrefsGroup2: Map<String, Array<String>>;
  selectedAgents: Array<string>;
  currentLines: Array<Array<string>>;
  algorithmSpecificData: Object;
  relevantPrefs: Array<string>;
}

export class StepBuilder {
  #step: Partial<Step> = {};

  constructor() {
    this.#step.algorithmSpecificData = new Object();
  }

  lineNumber(n: number): this {
    this.#step.lineNumber = n;
    return this;
  }

  freeAgents(agents: Array<Agent>): this {
    this.#step.freeAgents = agents;
    return this;
  }

  stepVariables(vars: Record<string, any>): this {
    this.#step.stepVariables = vars;
    return this;
  }

  group1Prefs(prefs: Map<String, Array<String>>): this {
    this.#step.currentPrefsGroup1 = prefs;
    return this;
  }

  group2Prefs(prefs: Map<String, Array<String>>): this {
    this.#step.currentPrefsGroup2 = prefs;
    return this;
  }

  selectedAgents(agents: Array<string>): this {
    this.#step.selectedAgents = agents;
    return this;
  }

  currentLines(lines: Array<Array<string>>): this {
    this.#step.currentLines = lines;
    return this;
  }

  algorithmData(data: Object): this {
    this.#step.algorithmSpecificData = data;
    return this;
  }

  relevantPrefs(prefs: Array<string>): this {
    this.#step.relevantPrefs = prefs;
    return this;
  }

  build(): Step {
    return this.#step as Step;
  }
}
