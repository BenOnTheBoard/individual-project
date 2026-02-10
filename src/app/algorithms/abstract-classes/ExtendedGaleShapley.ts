import { Agent } from '../interfaces/Agent';
import { AlgorithmData } from '../interfaces/AlgorithmData';
import { MatchingAlgorithm } from './MatchingAlgorithm';

export abstract class ExtendedGaleShapley extends MatchingAlgorithm {
  match(): AlgorithmData {
    // assign each resident to be free;
    this.saveStep(1);

    while (this.freeAgents.length > 0) {
      const currentAgent = this.freeAgents[0];
      this.freeAgents.shift();

      if (
        currentAgent.ranking.length > 0 &&
        !!this.getNextPotentialProposee(currentAgent)
      ) {
        this.saveStep(2, { '%currentAgent%': currentAgent.name });

        const proposee = this.getNextPotentialProposee(currentAgent);

        this.saveStep(3, {
          '%currentAgent%': currentAgent.name,
          '%potentialProposee%': proposee.name,
        });

        this.breakAssignment(currentAgent, proposee);
        this.provisionallyAssign(currentAgent, proposee);
        this.removeRuledOutPreferences(currentAgent, proposee);
      }
    }

    this.currentlySelectedAgents = [];
    this.relevantPreferences = [];
    this.saveStep(12);
    return;
  }

  abstract getNextPotentialProposee(currentAgent: Agent): Agent;

  abstract provisionallyAssign(
    currentAgent: Agent,
    potentialProposee: Agent,
  ): void;

  abstract removeRuledOutPreferences(
    currentAgent: Agent,
    potentialProposee: Agent,
  ): void;

  abstract breakAssignment(currentAgent: Agent, potentialProposee: Agent): void;
}
