import { Injectable } from '@angular/core';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
import { MatchingAlgorithm } from 'src/app/algorithms/abstract-classes/MatchingAlgorithm';
import { AlgorithmData } from 'src/app/algorithms/interfaces/AlgorithmData';

@Injectable({
  providedIn: 'root',
})
export class ExecutionService {
  commandMap = {};
  commandList = {};

  constructor(public algorithmRetrieval: AlgorithmRetrievalService) {}

  initialise(): void {
    this.commandMap = {};
    this.commandList = {};
  }

  getExecutionFlow(
    algorithm: string,
    numberOfAgents: number,
    numberOfGroup2Agents: number = numberOfAgents,
    preferences: Map<String, Array<String>>,
    SRstable: boolean = true,
  ): Object {
    this.initialise();
    const algRetriever: MatchingAlgorithm =
      this.algorithmRetrieval.mapOfAvailableAlgorithms.get(algorithm).service;
    this.commandMap =
      this.algorithmRetrieval.mapOfAvailableAlgorithms.get(
        algorithm,
      ).helpTextMap;

    const commandList: AlgorithmData = algRetriever.run(
      numberOfAgents,
      numberOfGroup2Agents,
      preferences,
      SRstable,
    );

    commandList.descriptions = this.generateDescriptions(commandList);

    return commandList;
  }

  // --------------------------------------------------------- FUNCTIONS TO GENERATE LINE DESCRIPTIONS

  generateDescriptions(commandList: AlgorithmData): Array<String> {
    const descriptions = [];

    for (const step of commandList.commands) {
      const lineNumber = step['lineNumber'];
      const { stepVariables } = step;

      if (stepVariables) {
        descriptions.push(this.generateMessage(lineNumber, stepVariables));
      } else {
        descriptions.push(this.commandMap[lineNumber]);
      }
    }

    return descriptions;
  }

  generateMessage(commandNum: number, replacements: Object): string {
    const str = this.commandMap[commandNum];
    return str.replace(
      /%\w+%/g,
      (all: string | number) => replacements[all] || all,
    );
  }
}
