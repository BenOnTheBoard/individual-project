import { Agent } from '../interfaces/Agent';
import { ExtendedGaleShapley } from './ExtendedGaleShapley';

// this file is the implementation for SM - EGS

export abstract class EgsOneToMany extends ExtendedGaleShapley {
  breakAssignment(currentAgent: Agent, potentialProposee: Agent) {
    // if w is currently assigned to someone {
    this.saveStep(4, { '%woman%': potentialProposee.name });
    if (potentialProposee.match.length < 1) {
      this.saveStep(6, { '%woman%': potentialProposee.name });
      return;
    }
    // break the provisional assignment of r to h'
    const matchPosition: number = this.getRank(
      potentialProposee,
      potentialProposee.match[0],
    );

    if (
      potentialProposee.match[0].ranking.filter(
        (agent) => agent.match[0] != currentAgent,
      ).length > 0 &&
      !this.freeAgents.includes(potentialProposee.match[0]) &&
      potentialProposee.match[0].ranking.length > 0
    ) {
      this.freeAgents.push(potentialProposee.match[0]);
    }

    this.currentLines = this.removeSubArray(this.currentLines, [
      this.utils.getLastChar(potentialProposee.match[0].name),
      this.utils.getLastChar(potentialProposee.name),
      'green',
    ]);

    this.changePrefsStyle(
      this.currentPrefsGroup1,
      this.utils.getLastChar(potentialProposee.match[0].name),
      this.originalPrefsGroup1
        .get(this.utils.getLastChar(potentialProposee.match[0].name))
        .findIndex(
          (woman) => woman == this.utils.getLastChar(potentialProposee.name),
        ),
      'grey',
    );
    this.changePrefsStyle(
      this.currentPrefsGroup2,
      this.utils.getLastChar(potentialProposee.name),
      matchPosition,
      'grey',
    );

    this.saveStep(5, {
      '%woman%': potentialProposee.name,
      '%currentPartner%': potentialProposee.match[0].name,
    });

    potentialProposee.ranking.splice(matchPosition, 1);
    potentialProposee.match[0].ranking.splice(
      this.getRank(potentialProposee.match[0], potentialProposee),
      1,
    );
  }

  provisionallyAssign(currentAgent: Agent, potentialProposee: Agent) {
    // provisionally assign r to h;

    const agentLastChar = this.utils.getLastChar(currentAgent.name);
    const proposeeLastChar = this.utils.getLastChar(potentialProposee.name);
    this.currentLines = this.removeSubArray(this.currentLines, [
      agentLastChar,
      proposeeLastChar,
      'red',
    ]);

    const greenLine = [agentLastChar, proposeeLastChar, 'green'];
    this.currentLines.push(greenLine);

    this.changePrefsStyle(
      this.currentPrefsGroup1,
      agentLastChar,
      this.originalPrefsGroup1
        .get(agentLastChar)
        .findIndex(
          (woman) => woman == this.utils.getLastChar(potentialProposee.name),
        ),
      'green',
    );
    this.changePrefsStyle(
      this.currentPrefsGroup2,
      proposeeLastChar,
      this.getRank(potentialProposee, currentAgent),
      'green',
    );

    this.saveStep(7, {
      '%man%': currentAgent.name,
      '%woman%': potentialProposee.name,
    });
    potentialProposee.match[0] = currentAgent;
    currentAgent.match.push(potentialProposee);
  }

  removeRuledOutPreferences(currentAgent: Agent, potentialProposee: Agent) {
    const currentAgentPosition: number = potentialProposee.ranking.findIndex(
      (agent: { name: string }) => agent.name == currentAgent.name,
    );

    let proposeeRankingClearCounter: number = currentAgentPosition + 1;

    // for each successor h' of h on r's list {
    this.saveStep(8, {
      '%man%': currentAgent.name,
      '%woman%': potentialProposee.name,
    });
    for (
      let i = currentAgentPosition + 1;
      i < potentialProposee.ranking.length;
      i++
    ) {
      const proposeePosition: number = this.getRank(
        potentialProposee.ranking[i],
        potentialProposee,
      );
      this.relevantPreferences.push(
        this.utils.getLastChar(potentialProposee.ranking[i].name),
      );
      // remove h' and r from each other's lists
      this.saveStep(9, {
        '%nextWorstMan%': potentialProposee.ranking[i].name,
        '%woman%': potentialProposee.name,
      });

      this.changePrefsStyle(
        this.currentPrefsGroup1,
        this.utils.getLastChar(potentialProposee.ranking[i].name),
        this.originalPrefsGroup1
          .get(this.utils.getLastChar(potentialProposee.ranking[i].name))
          .findIndex(
            (woman) => woman == this.utils.getLastChar(potentialProposee.name),
          ),
        'grey',
      );

      this.changePrefsStyle(
        this.currentPrefsGroup2,
        this.utils.getLastChar(potentialProposee.name),
        proposeeRankingClearCounter,
        'grey',
      );

      this.saveStep(10, {
        '%nextWorstMan%': potentialProposee.ranking[i].name,
        '%woman%': potentialProposee.name,
      });

      potentialProposee.ranking[i].ranking.splice(proposeePosition, 1);
      potentialProposee.ranking.splice(i, 1);
      i--;

      proposeeRankingClearCounter++;

      this.relevantPreferences.pop();
    }
    this.saveStep(11, {
      '%man%': currentAgent.name,
      '%woman%': potentialProposee.name,
    });
  }
}
