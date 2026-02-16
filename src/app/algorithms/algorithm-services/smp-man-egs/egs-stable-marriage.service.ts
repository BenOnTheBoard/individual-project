import { Injectable } from '@angular/core';
import { Man, Woman } from '../../interfaces/Agents';
import { AlgorithmData } from '../../interfaces/AlgorithmData';
import { SM } from '../../abstract-classes/SM';

@Injectable({
  providedIn: 'root',
})
export class EgsStableMarriageService extends SM {
  breakAssignment(currentAgent: Man, proposee: Woman) {
    this.saveStep(4, { '%woman%': proposee.name });
    if (proposee.match.length < 1) {
      this.saveStep(6, { '%woman%': proposee.name });
      return;
    }

    const match = proposee.match[0];

    if (
      match.ranking.filter((agent) => agent.match[0] != currentAgent).length >
        0 &&
      !this.freeAgents.includes(match) &&
      match.ranking.length > 0
    ) {
      this.freeAgents.push(match);
    }

    this.removeLine(match, proposee, 'green');
    this.stylePrefsMutual(match, proposee, 'grey');

    this.saveStep(5, {
      '%woman%': proposee.name,
      '%currentPartner%': match.name,
    });

    const matchRank = this.getRank(proposee, match);
    proposee.ranking.splice(matchRank, 1);
    match.ranking.splice(this.getRank(match, proposee), 1);
  }

  provisionallyAssign(agent: Man, proposee: Woman) {
    this.changeLineColour(agent, proposee, 'red', 'green');
    this.stylePrefsMutual(agent, proposee, 'green');

    this.saveStep(7, {
      '%man%': agent.name,
      '%woman%': proposee.name,
    });

    proposee.match[0] = agent;
    agent.match.push(proposee);
  }

  removeRuledOutPrefs(agent: Man, proposee: Woman) {
    this.saveStep(8, {
      '%man%': agent.name,
      '%woman%': proposee.name,
    });

    const agentRank = this.getRank(proposee, agent);
    for (let i = agentRank + 1; i < proposee.ranking.length; i++) {
      const reject = proposee.ranking[i];
      const proposeeRank = this.getRank(reject, proposee);
      this.relevantPrefs.push(this.utils.getAsChar(reject));

      this.saveStep(9, {
        '%nextWorstMan%': reject.name,
        '%woman%': proposee.name,
      });

      this.stylePrefsMutual(reject, proposee, 'grey');

      this.saveStep(10, {
        '%nextWorstMan%': reject.name,
        '%woman%': proposee.name,
      });

      reject.ranking.splice(proposeeRank, 1);
      proposee.ranking.splice(i, 1);
      i--;

      this.relevantPrefs.pop();
    }

    this.saveStep(11, {
      '%man%': agent.name,
      '%woman%': proposee.name,
    });
  }

  getNextProposee(currentAgent: Man): Woman {
    return currentAgent.ranking[0];
  }

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
}
