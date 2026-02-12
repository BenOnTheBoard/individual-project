import { Agent } from '../interfaces/Agent';
import { ExtendedGaleShapley } from './ExtendedGaleShapley';

// this file is the implementation for SM - EGS

export abstract class EgsOneToMany extends ExtendedGaleShapley {
  breakAssignment(currentAgent: Agent, proposee: Agent) {
    this.saveStep(4, { '%woman%': proposee.name });
    if (proposee.match.length < 1) {
      this.saveStep(6, { '%woman%': proposee.name });
      return;
    }

    const match = proposee.match[0];
    const matchPosition = this.getRank(proposee, match);

    if (
      match.ranking.filter((agent) => agent.match[0] != currentAgent).length >
        0 &&
      !this.freeAgents.includes(match) &&
      match.ranking.length > 0
    ) {
      this.freeAgents.push(match);
    }

    this.removeLine(match, proposee, 'green');
    this.changePrefsStyle('group1', match, proposee, 'grey');
    this.changePrefsStyleByIndex('group2', proposee, matchPosition, 'grey');

    this.saveStep(5, {
      '%woman%': proposee.name,
      '%currentPartner%': match.name,
    });

    proposee.ranking.splice(matchPosition, 1);
    match.ranking.splice(this.getRank(match, proposee), 1);
  }

  provisionallyAssign(agent: Agent, proposee: Agent) {
    this.changeLineColour(agent, proposee, 'red', 'green');
    this.changePrefsStyle('group1', agent, proposee, 'green');
    this.changePrefsStyleByIndex(
      'group2',
      proposee,
      this.getRank(proposee, agent),
      'green',
    );

    this.saveStep(7, {
      '%man%': agent.name,
      '%woman%': proposee.name,
    });

    proposee.match[0] = agent;
    agent.match.push(proposee);
  }

  removeRuledOutPrefs(agent: Agent, proposee: Agent) {
    this.saveStep(8, {
      '%man%': agent.name,
      '%woman%': proposee.name,
    });

    const agentRank = this.getRank(proposee, agent);
    for (let i = agentRank + 1; i < proposee.ranking.length; i++) {
      const reject = proposee.ranking[i];
      const proposeePosition = this.getRank(reject, proposee);
      this.relevantPrefs.push(this.utils.getLastChar(reject.name));

      this.saveStep(9, {
        '%nextWorstMan%': reject.name,
        '%woman%': proposee.name,
      });

      this.changePrefsStyle('group1', reject, proposee, 'grey');
      this.changePrefsStyle('group2', proposee, reject, 'grey');

      this.saveStep(10, {
        '%nextWorstMan%': reject.name,
        '%woman%': proposee.name,
      });

      reject.ranking.splice(proposeePosition, 1);
      proposee.ranking.splice(i, 1);
      i--;

      this.relevantPrefs.pop();
    }

    this.saveStep(11, {
      '%man%': agent.name,
      '%woman%': proposee.name,
    });
  }
}
