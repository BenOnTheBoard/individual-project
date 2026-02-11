import { Agent } from '../interfaces/Agent';
import { AlgorithmData } from '../interfaces/AlgorithmData';
import { MatchingAlgorithm } from './MatchingAlgorithm';

export abstract class ExtendedGaleShapley extends MatchingAlgorithm {
  match(): AlgorithmData {
    this.saveStep(1);

    while (this.freeAgents.length > 0) {
      const currentAgent = this.freeAgents[0];
      this.freeAgents.shift();

      if (
        currentAgent.ranking.length > 0 &&
        !!this.getNextProposee(currentAgent)
      ) {
        this.saveStep(2, { '%currentAgent%': currentAgent.name });

        const proposee = this.getNextProposee(currentAgent);

        this.saveStep(3, {
          '%currentAgent%': currentAgent.name,
          '%proposee%': proposee.name,
        });

        this.breakAssignment(currentAgent, proposee);
        this.provisionallyAssign(currentAgent, proposee);
        this.removeRuledOutPrefs(currentAgent, proposee);
      }
    }

    this.selectedAgents = [];
    this.relevantPrefs = [];
    this.saveStep(12);
    return;
  }

  abstract getNextProposee(currentAgent: Agent): Agent;

  abstract provisionallyAssign(currentAgent: Agent, proposee: Agent): void;

  abstract removeRuledOutPrefs(currentAgent: Agent, proposee: Agent): void;

  abstract breakAssignment(currentAgent: Agent, proposee: Agent): void;
}
