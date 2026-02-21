import { inject, Injectable } from '@angular/core';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval/algorithm-retrieval.service';
import { AlgorithmData } from 'src/app/algorithms/interfaces/AlgorithmData';

@Injectable({
  providedIn: 'root',
})
export class ExecutionService {
  #helpTextMap: Object;
  #commandList: AlgorithmData;

  protected algRetriever = inject(AlgorithmRetrievalService);

  getExecutionFlow(
    algorithm: string,
    numberOfAgents: number,
    numberOfG2Agents: number = numberOfAgents,
    SRstable: boolean = true,
  ): AlgorithmData {
    const { service, helpTextMap } = this.algRetriever.getAlgorithm(algorithm);
    this.#helpTextMap = helpTextMap;
    this.#commandList = service.run(numberOfAgents, numberOfG2Agents, SRstable);

    this.#commandList.descriptions = this.#generateDescriptions();
    return this.#commandList;
  }

  #generateDescriptions(): Array<String> {
    const descriptions = [];

    for (const step of this.#commandList.commands) {
      const { lineNumber, stepVariables } = step;

      if (stepVariables) {
        descriptions.push(this.#generateMessage(lineNumber, stepVariables));
      } else {
        descriptions.push(this.#helpTextMap[lineNumber]);
      }
    }

    return descriptions;
  }

  #generateMessage(commandNum: number, replacements: Object): string {
    const str = this.#helpTextMap[commandNum];
    return str.replace(
      /%\w+%/g,
      (all: string | number) => replacements[all] || all,
    );
  }
}
