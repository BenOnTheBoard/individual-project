import { Agent } from '../interfaces/Agent';
import { ExtendedGaleShapley } from './ExtendedGaleShapley';

// this file is the implementation for SM - EGS

export abstract class EgsOneToMany extends ExtendedGaleShapley {
  breakAssignment(currentAgent: Agent, proposee: Agent) {
    // if w is currently assigned to someone {
    this.saveStep(4, { '%woman%': proposee.name });
    if (proposee.match.length < 1) {
      this.saveStep(6, { '%woman%': proposee.name });
      return;
    }
    // break the provisional assignment of r to h'
    const matchPosition: number = this.getRank(proposee, proposee.match[0]);

    if (
      proposee.match[0].ranking.filter(
        (agent) => agent.match[0] != currentAgent,
      ).length > 0 &&
      !this.freeAgents.includes(proposee.match[0]) &&
      proposee.match[0].ranking.length > 0
    ) {
      this.freeAgents.push(proposee.match[0]);
    }

    this.currentLines = this.removeSubArray(this.currentLines, [
      this.utils.getLastChar(proposee.match[0].name),
      this.utils.getLastChar(proposee.name),
      'green',
    ]);

    this.changePrefsStyle('group1', proposee.match[0], proposee, 'grey');
    this.changePrefsStyleByIndex('group2', proposee, matchPosition, 'grey');

    this.saveStep(5, {
      '%woman%': proposee.name,
      '%currentPartner%': proposee.match[0].name,
    });

    proposee.ranking.splice(matchPosition, 1);
    proposee.match[0].ranking.splice(
      this.getRank(proposee.match[0], proposee),
      1,
    );
  }

  provisionallyAssign(currentAgent: Agent, proposee: Agent) {
    // provisionally assign r to h;

    const agentLastChar = this.utils.getLastChar(currentAgent.name);
    const proposeeLastChar = this.utils.getLastChar(proposee.name);
    this.currentLines = this.removeSubArray(this.currentLines, [
      agentLastChar,
      proposeeLastChar,
      'red',
    ]);

    const greenLine = [agentLastChar, proposeeLastChar, 'green'];
    this.currentLines.push(greenLine);

    this.changePrefsStyle('group1', currentAgent, proposee, 'green');
    this.changePrefsStyleByIndex(
      'group2',
      proposee,
      this.getRank(proposee, currentAgent),
      'green',
    );

    this.saveStep(7, {
      '%man%': currentAgent.name,
      '%woman%': proposee.name,
    });
    proposee.match[0] = currentAgent;
    currentAgent.match.push(proposee);
  }

  removeRuledOutPrefs(currentAgent: Agent, proposee: Agent) {
    const currentAgentPosition: number = proposee.ranking.findIndex(
      (agent: { name: string }) => agent.name == currentAgent.name,
    );

    // for each successor h' of h on r's list {
    this.saveStep(8, {
      '%man%': currentAgent.name,
      '%woman%': proposee.name,
    });
    for (let i = currentAgentPosition + 1; i < proposee.ranking.length; i++) {
      const proposeePosition: number = this.getRank(
        proposee.ranking[i],
        proposee,
      );
      this.relevantPrefs.push(this.utils.getLastChar(proposee.ranking[i].name));
      // remove h' and r from each other's lists
      this.saveStep(9, {
        '%nextWorstMan%': proposee.ranking[i].name,
        '%woman%': proposee.name,
      });

      this.changePrefsStyle('group1', proposee.ranking[i], proposee, 'grey');
      this.changePrefsStyle('group2', proposee, proposee.ranking[i], 'grey');

      this.saveStep(10, {
        '%nextWorstMan%': proposee.ranking[i].name,
        '%woman%': proposee.name,
      });

      proposee.ranking[i].ranking.splice(proposeePosition, 1);
      proposee.ranking.splice(i, 1);
      i--;

      this.relevantPrefs.pop();
    }
    this.saveStep(11, {
      '%man%': currentAgent.name,
      '%woman%': proposee.name,
    });
  }
}
