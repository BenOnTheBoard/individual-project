import { Agent } from '../interfaces/Agent';
import { AlgorithmData } from '../interfaces/AlgorithmData';
import { MatchingAlgorithm } from './MatchingAlgorithm';

export abstract class ExtendedGaleShapley extends MatchingAlgorithm {
  match(): AlgorithmData {
    // assign each resident to be free;
    this.saveStep(1);

    while (this.freeAgents.length > 0) {
      const currentAgent = this.group1Agents.get(this.freeAgents[0]);

      if (
        currentAgent.ranking.length > 0 &&
        !!this.getNextPotentialProposee(currentAgent)
      ) {
        this.saveStep(2, { '%currentAgent%': currentAgent.name });

        // r := first such resident on h's list;
        const potentialProposee: Agent =
          this.getNextPotentialProposee(currentAgent);

        this.saveStep(3, {
          '%currentAgent%': currentAgent.name,
          '%potentialProposee%': potentialProposee.name,
        });

        // if h is fully subscribed, then break the assignment of the worst resident of that hospital
        this.breakAssignment(currentAgent, potentialProposee);

        this.provisionallyAssign(currentAgent, potentialProposee);

        this.removeRuledOutPreferences(currentAgent, potentialProposee);
      }

      this.freeAgents.shift();
    }

    this.currentlySelectedAgents = [];
    this.relevantPreferences = [];
    // a stable matching has been found
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
