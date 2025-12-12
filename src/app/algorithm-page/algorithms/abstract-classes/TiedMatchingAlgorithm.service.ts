import { TiedAgent } from '../interfaces/tied/TiedAgent';
import { TiedAlgorithmData } from '../interfaces/tied/TiedAlgorithmData';
import { TiedStep } from '../interfaces/tied/TiedStep';

export abstract class TiedMatchingAlgorithm {
  abstract group1Name: string;
  abstract group2Name: string;

  numberOfAgents: number;
  numberOfGroup2Agents: number;

  freeAgentsOfGroup1: string[] = [];

  group1Agents: Map<string, TiedAgent> = new Map();
  group2Agents: Map<string, TiedAgent> = new Map();

  algorithmData: TiedAlgorithmData = {
    commands: [],
    descriptions: [],
  };

  SRstable: boolean = true;

  currentLine: string[] = [];

  originalGroup1CurrentPreferences: Map<string, string[][]> = new Map();
  originalGroup2CurrentPreferences: Map<string, string[][]> = new Map();

  group1CurrentPreferences: Map<string, string[][]> = new Map();
  group2CurrentPreferences: Map<string, string[][]> = new Map();
  currentlySelectedAgents: string[] = [];
  currentLines: string[][] = [];

  algorithmSpecificData: object = {};

  relevantPreferences: string[] = [];

  stabilityType: string;
  stable: boolean = false;

  protected prefStyleColors: Record<string, string> = {
    green: '#53D26F',
    red: '#EB2A2A',
    grey: '#C4C4C4',
    black: '#000000',
  };

  constructor() {}

  initialise(
    numberOfAgents: number,
    numberOfGroup2Agents: number = numberOfAgents,
    stabilityType: string
  ): void {
    this.freeAgentsOfGroup1 = [];

    this.group1Agents = new Map();
    this.group2Agents = new Map();

    this.algorithmData = {
      commands: [],
      descriptions: [],
    };

    this.currentLine = [];

    this.group1CurrentPreferences = new Map();
    this.group2CurrentPreferences = new Map();
    this.currentlySelectedAgents = [];
    this.currentLines = [];
    this.algorithmSpecificData = {};

    this.relevantPreferences = [];

    this.numberOfAgents = numberOfAgents;
    this.numberOfGroup2Agents = numberOfGroup2Agents;

    this.stabilityType = stabilityType;
    this.stable = false;
  }

  generateAgents(): void {
    for (let i = 1; i <= this.numberOfAgents; i++) {
      const group1AgentName = this.group1Name + i;

      this.group1Agents.set(group1AgentName, {
        name: group1AgentName,
        match: [],
        ranking: [],
      });

      this.freeAgentsOfGroup1.push(group1AgentName);
    }

    let currentLetter = 'A';
    for (let i = 1; i <= this.numberOfGroup2Agents; i++) {
      const group2AgentName = this.group2Name + currentLetter;

      this.group2Agents.set(group2AgentName, {
        name: group2AgentName,
        match: [],
        ranking: [],
      });

      currentLetter = String.fromCharCode(
        ((currentLetter.charCodeAt(0) + 1 - 65) % 26) + 65
      );
    }
  }

  createTiedListFromList(list: TiedAgent[]): TiedAgent[][] {
    const tiedList: TiedAgent[][] = [];
    const copy = [...list];
    this.shuffle(copy);
    while (copy.length) {
      const groupSize = Math.ceil(Math.random() * 2); // 1-2 agents per tie
      tiedList.push(copy.splice(0, groupSize));
    }
    return tiedList;
  }

  generatePreferences(): void {
    for (const agent of Array.from(this.group1Agents.values())) {
      const agent1Rankings = Array.from(this.group2Agents.values());
      const tiedPreferences = this.createTiedListFromList(agent1Rankings);
      this.group1Agents.get(agent.name)!.ranking = tiedPreferences;
    }

    for (const agent of Array.from(this.group2Agents.values())) {
      const agent2Rankings = Array.from(this.group1Agents.values());
      const tiedPreferences = this.createTiedListFromList(agent2Rankings);
      this.group2Agents.get(agent.name)!.ranking = tiedPreferences;
    }
  }

  private populateAgentPreferences(
    agentName: string,
    agentMap: Map<string, TiedAgent>,
    targetMap: Map<string, TiedAgent>,
    targetPrefix: string,
    preferences: Map<string, string[][]>
  ): void {
    const id = this.getLastCharacter(agentName);
    const prefGroups = preferences.get(id) || [];

    const flatList: TiedAgent[] = [];
    for (const group of prefGroups) {
      for (const symbol of group) {
        const targetName = targetPrefix + symbol;
        const target = targetMap.get(targetName);
        if (target) {
          flatList.push(target);
        }
      }
    }

    const tiedList = this.createTiedListFromList(flatList);
    agentMap.get(agentName)!.ranking = tiedList;
  }

  populatePreferences(preferences: Map<string, string[][]>): void {
    for (const agentName of this.group1Agents.keys()) {
      this.populateAgentPreferences(
        agentName,
        this.group1Agents,
        this.group2Agents,
        this.group2Name,
        preferences
      );
    }

    for (const agentName of this.group2Agents.keys()) {
      this.populateAgentPreferences(
        agentName,
        this.group2Agents,
        this.group1Agents,
        this.group1Name,
        preferences
      );
    }
  }

  // FROM: https://javascript.info/task/shuffle
  shuffle(array: object[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  getGroupRankings(agents: Map<string, TiedAgent>): Map<string, string[][]> {
    const matches = new Map<string, string[][]>();

    for (const agent of Array.from(agents.values())) {
      const preferenceTies: string[][] = [];
      for (const tie of agent.ranking) {
        preferenceTies.push(
          tie.map((match) => this.getLastCharacter(match.name))
        );
      }
      matches.set(this.getLastCharacter(agent.name), preferenceTies);
    }

    return matches;
  }

  clone(mapIn: Map<string, string[][]>): Map<string, string[][]> {
    const mapCloned = new Map<string, string[][]>();
    mapIn.forEach((ties, key) => {
      mapCloned.set(
        key,
        ties.map((tie) => [...tie])
      );
    });
    return mapCloned;
  }

  update(step: number, stepVariables?: object): void {
    const currentStep: TiedStep = {
      lineNumber: step,
      freeAgents: [...this.freeAgentsOfGroup1],
      matches: new Map(),
      stepVariables,
      group1CurrentPreferences: this.clone(this.group1CurrentPreferences),
      group2CurrentPreferences: this.clone(this.group2CurrentPreferences),
      currentlySelectedAgents: [...this.currentlySelectedAgents],
      currentLines: this.currentLines.map((line) => [...line]),
      algorithmSpecificData: { ...this.algorithmSpecificData },
      relevantPreferences: [...this.relevantPreferences],
    };

    this.algorithmData.commands.push(currentStep);
  }

  getMatches(): Map<string, string[]> {
    const matches = new Map<string, string[]>();

    for (let i = 1; i <= this.numberOfGroup2Agents; i++) {
      const agentName = this.group2Name + String.fromCharCode(i + 64);
      const agent = this.group2Agents.get(agentName)!;

      const matchList: string[] = agent.match.map((m) => m.name);
      matches.set(agent.name, matchList);
    }

    return matches;
  }

  findPositionInMatches(
    currentAgent: TiedAgent,
    agentToFind: TiedAgent
  ): number {
    const ranking = currentAgent.ranking;
    for (let groupIndex = 0; groupIndex < ranking.length; groupIndex++) {
      if (ranking[groupIndex].some((a) => a.name === agentToFind.name)) {
        return groupIndex;
      }
    }
    return -1;
  }

  private findPositionInOriginalPreferences(
    agent: TiedAgent,
    agentToFind: TiedAgent,
    originalPreferences: Map<string, string[][]>
  ): number {
    const originalAgentPrefs = originalPreferences.get(
      this.getLastCharacter(agent.name)
    );
    const target = this.getLastCharacter(agentToFind.name);

    for (let tieIdx = 0; tieIdx < originalAgentPrefs.length; tieIdx++) {
      if (originalAgentPrefs[tieIdx].includes(target)) {
        return tieIdx;
      }
    }
    return -1; // analogously to indexOf
  }

  findPositionInOriginalMatches(
    currentAgent: TiedAgent,
    agentToFind: TiedAgent
  ): number {
    return this.findPositionInOriginalPreferences(
      currentAgent,
      agentToFind,
      this.originalGroup1CurrentPreferences
    );
  }

  findPositionInOriginalMatches1Group(
    currentAgent: TiedAgent,
    agentToFind: TiedAgent
  ): number {
    return this.findPositionInOriginalPreferences(
      currentAgent,
      agentToFind,
      this.originalGroup1CurrentPreferences
    );
  }

  findPositionInOriginalMatchesGroup2(
    currentAgent: TiedAgent,
    agentToFind: TiedAgent
  ): number {
    return this.findPositionInOriginalPreferences(
      currentAgent,
      agentToFind,
      this.originalGroup2CurrentPreferences
    );
  }

  getLastCharacter(name: string): string {
    return name.slice(-1);
  }

  checkArrayEquality(a: string[], b: string[]): boolean {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }

  // used to remove elements from currentLines
  removeArrayFromArray(a: string[][], b: string[]): void {
    for (let i = a.length - 1; i >= 0; i--) {
      if (this.checkArrayEquality(a[i], b)) {
        a.splice(i, 1);
      }
    }
  }

  // used to remove all lines in array that start at person
  removePersonFromArray(a: string[][], person: string): void {
    for (let i = a.length - 1; i >= 0; i--) {
      if (a[i][0] === person) {
        a.splice(i, 1);
      }
    }
  }

  // used to remove all lines leading to a target person from the array
  removeTargetFromArray(a: string[][], person: string): void {
    for (let i = a.length - 1; i >= 0; i--) {
      if (a[i][1] === person) {
        a.splice(i, 1);
      }
    }
  }

  changePreferenceStyle(
    preferenceList: Map<string, string[]>,
    person: string,
    position: number,
    style: string
  ): void {
    const prefs = preferenceList.get(person);
    let currentAgent = '';

    if (prefs[position].includes('#')) {
      currentAgent = prefs[position].charAt(prefs[position].length - 2);
    } else {
      currentAgent = prefs[position].charAt(prefs[position].length - 1);
    }

    const hex = this.prefStyleColors[style] ?? this.prefStyleColors.black;
    prefs[position] = `{${hex}${currentAgent}}`;
  }

  checkStrongStability(allMatches: Map<String, Array<String>>): boolean {
    // TO-DO: implement before implementing SMT Strong
    return false;
  }

  checkSuperStability(allMatches: Map<string, string[]>): boolean {
    // For all group2 agents (e.g. hospitals)
    for (const agentName of allMatches.keys()) {
      const agentMatches = allMatches.get(agentName)!;
      if (agentMatches.length === 0) continue; // unmatched so we skip

      const agent = this.group2Agents.get(agentName)!;
      const lastAgentPosition = this.getLastMatch(agentName, agentMatches);

      // all better or equal ties
      for (let i = lastAgentPosition; i >= 0; i--) {
        for (const betterCandidate of agent.ranking[i]) {
          if (agentMatches.includes(betterCandidate.name)) continue; // already matched, skip
          const candidateMatch = betterCandidate.match[0];
          if (!candidateMatch) continue; // unmatched so we skip

          const candidateMatchPosition =
            this.findPositionInOriginalMatchesGroup2(
              betterCandidate,
              candidateMatch
            );
          const currentAgentPosition = this.findPositionInOriginalMatchesGroup2(
            betterCandidate,
            agent
          );

          // prefers or indifferent to
          if (
            currentAgentPosition !== -1 &&
            (currentAgentPosition < candidateMatchPosition ||
              currentAgentPosition === candidateMatchPosition)
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  getLastMatch(currentAgent: string, agentMatches: string[]): number {
    let furthestIndex = 0;
    for (const matchAgent of agentMatches) {
      const matchPosition = this.findPositionInMatches(
        this.group2Agents.get(currentAgent),
        this.group1Agents.get(matchAgent)
      );
      if (matchPosition > furthestIndex) {
        furthestIndex = matchPosition;
      }
    }
    return furthestIndex;
  }

  abstract match(): TiedAlgorithmData;

  run(
    numberOfAgents: number,
    numberOfGroup2Agents: number = numberOfAgents,
    preferences: Map<string, string[][]>,
    stabiltyType: string,
    SRstable: boolean = true
  ): TiedAlgorithmData | undefined {
    this.initialise(numberOfAgents, numberOfGroup2Agents, stabiltyType);
    this.SRstable = SRstable;

    this.generateAgents();

    if (preferences) {
      this.populatePreferences(preferences);
    } else {
      this.generatePreferences();
    }

    this.group1CurrentPreferences = this.getGroupRankings(this.group1Agents);
    this.originalGroup1CurrentPreferences = this.clone(
      this.group1CurrentPreferences
    );

    this.group2CurrentPreferences = this.getGroupRankings(this.group2Agents);
    this.originalGroup2CurrentPreferences = this.clone(
      this.group2CurrentPreferences
    );

    this.match();

    if (this.stabilityType === 'strong') {
      this.stable = this.checkStrongStability(this.getMatches());
    } else if (this.stabilityType === 'super') {
      this.stable = this.checkSuperStability(this.getMatches());
    }

    if (!this.stable) {
      return undefined;
    }

    return this.algorithmData;
  }
}
