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

  freeAgentsOfGroup1: Array<String>;

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

  group1CurrentPreferences: Map<String, Array<String>> = new Map();
  group2CurrentPreferences: Map<String, Array<String>> = new Map();
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
    this.freeAgentsOfGroup1 = [];

    this.group1Agents = new Map();
    this.group2Agents = new Map();

    this.algorithmData = {
      commands: new Array(),
      descriptions: new Array(),
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

    this.stable = false;
  }

  generateAgents() {
    for (let i = 1; i < this.numberOfAgents + 1; i++) {
      const group1AgentName = this.group1Name + i;

      this.group1Agents.set(group1AgentName, {
        name: group1AgentName,
        match: new Array(),
        ranking: new Array(),
      });

      this.freeAgentsOfGroup1.push(group1AgentName);
    }

    for (let i = 0; i < this.numberOfGroup2Agents; i++) {
      const currentLetter = String.fromCharCode(65 + i);
      const group2AgentName = this.group2Name + currentLetter;

      this.group2Agents.set(group2AgentName, {
        name: group2AgentName,
        match: new Array(),
        ranking: new Array(),
      });
    }
  }

  // generates rankings for all agents
  // changes agent.ranking
  generatePreferences(): void {
    for (const agent of Array.from(this.group1Agents.values())) {
      const agent1Rankings = Array.from(new Map(this.group2Agents).values());
      this.utils.shuffle(agent1Rankings);
      this.group1Agents.get(agent.name).ranking = agent1Rankings;
    }

    for (const agent of Array.from(this.group2Agents.values())) {
      const agent2Rankings = Array.from(new Map(this.group1Agents).values());
      this.utils.shuffle(agent2Rankings);
      this.group2Agents.get(agent.name).ranking = agent2Rankings;
    }
  }

  populatePreferences(preferences: Map<String, Array<String>>): void {
    let tempCopyList: Array<Agent>;

    for (const agent of Array.from(this.group1Agents.keys())) {
      tempCopyList = [];
      for (const preferenceAgent of preferences.get(
        this.utils.getLastChar(String(agent)),
      )) {
        tempCopyList.push(
          this.group2Agents.get(this.group2Name + preferenceAgent),
        );
      }
      this.group1Agents.get(agent).ranking = tempCopyList;
    }

    for (const agent of Array.from(this.group2Agents.keys())) {
      tempCopyList = [];
      for (const preferenceAgent of preferences.get(
        this.utils.getLastChar(String(agent)),
      )) {
        tempCopyList.push(
          this.group1Agents.get(this.group1Name + preferenceAgent),
        );
      }
      this.group2Agents.get(agent).ranking = tempCopyList;
    }
  }

  getGroupRankings(agents: Map<String, Agent>): Map<String, Array<String>> {
    const matches: Map<String, Array<String>> = new Map();

    for (const agent of Array.from(agents.values())) {
      const preferenceList = [];
      for (const match of agent.ranking) {
        preferenceList.push(this.utils.getLastChar(match.name));
      }
      const identifier = this.utils.getLastChar(agent.name);
      matches.set(identifier, preferenceList);
    }

    return matches;
  }

  update(step: number, stepVariables?: Object): void {
    const currentStep = new StepBuilder()
      .lineNumber(step)
      .freeAgents(Object.assign([], this.freeAgentsOfGroup1))
      .matches(new Map())
      .stepVariables(stepVariables)
      .group1Prefs(this.utils.cloneMap(this.group1CurrentPreferences))
      .group2Prefs(this.utils.cloneMap(this.group2CurrentPreferences))
      .selectedAgents(JSON.parse(JSON.stringify(this.currentlySelectedAgents)))
      .currentLines(JSON.parse(JSON.stringify(this.currentLines)))
      .algorithmData(JSON.parse(JSON.stringify(this.algorithmSpecificData)))
      .relevantPrefs(JSON.parse(JSON.stringify(this.relevantPreferences)))
      .build();
    this.algorithmData.commands.push(currentStep);
  }

  getMatches(): Map<String, Array<String>> {
    const matches: Map<String, Array<String>> = new Map();

    for (let i = 1; i < this.numberOfGroup2Agents + 1; i++) {
      const agentName: string = this.group2Name + String.fromCharCode(i + 64);
      const agent: Agent = this.group2Agents.get(agentName);

      const matchList: Array<String> = new Array();

      for (const match of agent.match) {
        matchList.push(match.name);
      }

      matches.set(agent.name, matchList);
    }

    return matches;
  }

  findPositionInRanking(currentAgent: Agent, agentToFind: Agent): number {
    return currentAgent.ranking.findIndex(
      (agent: { name: string }) => agent.name == agentToFind.name,
    );
  }

  findPositionInOriginalMatches(
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

  // used to remove elements from currentLines
  removeArrayFromArray(a: Array<Array<string>>, b: Array<string>) {
    let arrayPositionCounter: number = 0;
    for (const subArray of a) {
      if (this.utils.checkArrayEquality(subArray, b)) {
        a.splice(arrayPositionCounter, 1);
      }
      arrayPositionCounter++;
    }
  }

  // remove all lines in array that start at person
  removePersonFromArray(a: Array<Array<string>>, person: String) {
    let arrayPositionCounter: number = 0;
    for (const subArray of a) {
      if (subArray[0] == person) {
        a.splice(arrayPositionCounter, 1);
      }
      arrayPositionCounter++;
    }
  }

  // remove all lines leeding to a person from the array
  removeTargetFromArray(a: Array<Array<string>>, person: String) {
    let arrayPositionCounter: number = 0;
    for (const subArray of a) {
      if (subArray[1] == person) {
        a.splice(arrayPositionCounter, 1);
      }
      arrayPositionCounter++;
    }
  }

  changePreferenceStyle(
    preferenceList: Map<String, Array<String>>,
    person: string,
    position: number,
    style: string,
  ) {
    let currentAgent: string = '';

    currentAgent = preferenceList.get(person)[position].includes('#')
      ? preferenceList
          .get(person)
          [position].charAt(preferenceList.get(person)[position].length - 2)
      : preferenceList
          .get(person)
          [position].charAt(preferenceList.get(person)[position].length - 1);

    const colour = this.colourHexService.getHex(style);
    preferenceList.get(person)[position] = `{${colour}${currentAgent}}`;
  }

  checkStability(allMatches: Map<String, Array<String>>): boolean {
    for (const agent of allMatches.keys()) {
      const agentMatches = allMatches.get(agent);

      if (agentMatches.length > 0) {
        const lastAgentPosition = this.getLastMatch(agent, agentMatches);
        const agentPreferences: Array<Agent> =
          this.group2Agents.get(agent).ranking;

        for (let i = lastAgentPosition - 1; i >= 0; i--) {
          if (!agentMatches.includes(agentPreferences[i].name)) {
            const matchPosition = this.findPositionInOriginalMatches(
              agentPreferences[i],
              agentPreferences[i].match[0],
              'group1',
            );
            const currentAgentPosition = this.findPositionInOriginalMatches(
              agentPreferences[i],
              this.group2Agents.get(agent),
              'group1',
            );
            if (currentAgentPosition < matchPosition) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  getLastMatch(currentAgent: String, agentMatches: Array<String>): number {
    let furthestIndex: number = 0;
    for (const matchAgent of agentMatches) {
      const matchPosition = this.findPositionInRanking(
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
    preferences: Map<String, Array<String>>,
    SRstable: boolean = true,
  ): AlgorithmData {
    if (numberOfGroup2Agents == numberOfAgents) {
      this.initialise(numberOfAgents);
    } else {
      this.initialise(numberOfAgents, numberOfGroup2Agents);
    }

    this.SRstable = SRstable;

    this.generateAgents();

    if (preferences) {
      this.populatePreferences(preferences);
    } else {
      this.generatePreferences();
    }

    this.group1CurrentPreferences = this.getGroupRankings(this.group1Agents);
    this.originalPrefsGroup1 = this.getGroupRankings(this.group1Agents);

    this.group2CurrentPreferences = this.getGroupRankings(this.group2Agents);
    this.originalPrefsGroup2 = this.getGroupRankings(this.group2Agents);

    this.match();

    this.stable = this.checkStability(this.getMatches());

    if (!this.stable) {
      return undefined;
    }

    return this.algorithmData;
  }
}
