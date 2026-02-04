import { Agent } from '../interfaces/Agent';
import { AlgorithmData } from '../interfaces/AlgorithmData';
import { Step } from '../interfaces/Step';
import { UtilsService } from 'src/app/utils/utils.service';

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

  originalGroup1CurrentPreferences: Map<String, Array<String>> = new Map();
  originalGroup2CurrentPreferences: Map<String, Array<String>> = new Map();

  group1CurrentPreferences: Map<String, Array<String>> = new Map();
  group2CurrentPreferences: Map<String, Array<String>> = new Map();
  currentlySelectedAgents: Array<string> = [];
  currentLines: Array<Array<string>> = [];

  algorithmSpecificData: Object = {};

  relevantPreferences: Array<string> = [];

  stable: boolean = false;

  constructor(public utils: UtilsService) {}

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

    let currentLetter = 'A';

    for (let i = 1; i < this.numberOfGroup2Agents + 1; i++) {
      const group2AgentName = this.group2Name + currentLetter;

      this.group2Agents.set(group2AgentName, {
        name: group2AgentName,
        match: new Array(),
        ranking: new Array(),
      });

      currentLetter = String.fromCharCode(
        ((currentLetter.charCodeAt(0) + 1 - 65) % 26) + 65,
      );
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
        preferenceList.push(match.name.slice(match.name.length - 1));
      }

      const identifier: string = agent.name.slice(agent.name.length - 1);

      matches.set(identifier, preferenceList);
    }

    return matches;
  }

  update(step: number, stepVariables?: Object): void {
    const currentStep: Step = {
      lineNumber: step,
      freeAgents: Object.assign([], this.freeAgentsOfGroup1),
      matches: new Map(),
      stepVariables,
      group1CurrentPreferences: this.utils.cloneMap(
        this.group1CurrentPreferences,
      ),
      group2CurrentPreferences: this.utils.cloneMap(
        this.group2CurrentPreferences,
      ),
      currentlySelectedAgents: JSON.parse(
        JSON.stringify(this.currentlySelectedAgents),
      ),
      currentLines: JSON.parse(JSON.stringify(this.currentLines)),
      algorithmSpecificData: JSON.parse(
        JSON.stringify(this.algorithmSpecificData),
      ),
      relevantPreferences: JSON.parse(JSON.stringify(this.relevantPreferences)),
    };

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

  findPositionInMatches(currentAgent: Agent, agentToFind: Agent): number {
    const position: number = currentAgent.ranking.findIndex(
      (agent: { name: string }) => agent.name == agentToFind.name,
    );
    return position;
  }

  findPositionInOriginalMatches(currentAgent: Agent, agentToFind: Agent) {
    const originalPreferences = this.originalGroup1CurrentPreferences.get(
      currentAgent.name[currentAgent.name.length - 1],
    );
    const position: number = originalPreferences.indexOf(
      agentToFind.name[agentToFind.name.length - 1],
    );
    return position;
  }

  findPositionInOriginalMatches1Group(currentAgent: Agent, agentToFind: Agent) {
    const originalPreferences = this.originalGroup1CurrentPreferences.get(
      this.utils.getLastChar(currentAgent.name),
    );
    const position: number = originalPreferences.indexOf(
      this.utils.getLastChar(agentToFind.name),
    );
    return position;
  }

  findPositionInOriginalMatchesGroup2(currentAgent: Agent, agentToFind: Agent) {
    const originalPreferences = this.originalGroup2CurrentPreferences.get(
      currentAgent.name[currentAgent.name.length - 1],
    );
    const position: number = originalPreferences.indexOf(
      agentToFind.name[agentToFind.name.length - 1],
    );
    return position;
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

    if (style == 'green') {
      style = '#53D26F';
    } else if (style == 'red') {
      style = '#EB2A2A';
    } else if (style == 'grey') {
      style = '#C4C4C4';
    } else if (style == 'black') {
      style = '#000000';
    }

    preferenceList.get(person)[position] = `{${style}${currentAgent}}`;
  }

  checkStability(allMatches: Map<String, Array<String>>): boolean {
    let stability = true;

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
            );
            const currentAgentPosition = this.findPositionInOriginalMatches(
              agentPreferences[i],
              this.group2Agents.get(agent),
            );
            if (currentAgentPosition < matchPosition) {
              stability = false;
            }
          }
        }
      }
    }
    return stability;
  }

  getLastMatch(currentAgent: String, agentMatches: Array<String>): number {
    let furthestIndex: number = 0;
    for (const matchAgent of agentMatches) {
      const matchPosition = this.findPositionInMatches(
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
    this.originalGroup1CurrentPreferences = this.getGroupRankings(
      this.group1Agents,
    );

    this.group2CurrentPreferences = this.getGroupRankings(this.group2Agents);
    this.originalGroup2CurrentPreferences = this.getGroupRankings(
      this.group2Agents,
    );

    this.match();

    this.stable = this.checkStability(this.getMatches());

    if (!this.stable) {
      return undefined;
    }

    return this.algorithmData;
  }
}
