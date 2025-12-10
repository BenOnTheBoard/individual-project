import { Agent } from '../interfaces/Agent';
import { AlgorithmData } from '../interfaces/AlgorithmData';
import { MatchingAlgorithm } from './MatchingAlgorithm';

export abstract class ExtendedGaleShapley extends MatchingAlgorithm {
  match(): AlgorithmData {
    // assign each resident to be free;
    this.update(1);

    while (this.freeAgentsOfGroup1.length > 0) {
      let currentAgent = this.group1Agents.get(this.freeAgentsOfGroup1[0]);

      if (
        currentAgent.ranking.length <= 0 ||
        !this.getNextPotentialProposee(currentAgent)
      ) {
        this.freeAgentsOfGroup1.shift();
      } else {
        this.update(2, { '%currentAgent%': currentAgent.name });

        // r := first such resident on h's list;
        let potentialProposee: Agent =
          this.getNextPotentialProposee(currentAgent);

        this.update(3, {
          '%currentAgent%': currentAgent.name,
          '%potentialProposee%': potentialProposee.name,
        });

        // if h is fully subscribed, then break the assignment of the worst resident of that hospital
        this.breakAssignment(currentAgent, potentialProposee);

        this.provisionallyAssign(currentAgent, potentialProposee);

        this.removeRuledOutPreferences(currentAgent, potentialProposee);

        if (this.shouldContinueMatching(currentAgent)) {
          this.freeAgentsOfGroup1.shift();
        }
      }
    }

    this.currentlySelectedAgents = [];
    this.relevantPreferences = [];
    // a stable matching has been found
    this.update(12);

    return;
  }

  abstract getNextPotentialProposee(currentAgent: Agent): Agent;

  abstract shouldContinueMatching(currentAgent: Agent): boolean;

  abstract provisionallyAssign(
    currentAgent: Agent,
    potentialProposee: Agent
  ): void;

  abstract removeRuledOutPreferences(
    currentAgent: Agent,
    potentialProposee: Agent
  ): void;

  abstract breakAssignment(currentAgent: Agent, potentialProposee: Agent): void;
}
