export interface TiedStep {
  lineNumber: number;
  freeAgents: string[];
  matches: Map<string, string[]>;
  stepVariables?: object;
  group1CurrentPreferences: Map<string, string[][]>;
  group2CurrentPreferences: Map<string, string[][]>;
  currentlySelectedAgents: string[];
  currentLines: string[][];
  algorithmSpecificData: object;
  relevantPreferences: string[];
}
