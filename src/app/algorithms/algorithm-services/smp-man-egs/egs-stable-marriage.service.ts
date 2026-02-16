import { Injectable } from '@angular/core';
import { Man, Woman } from '../../interfaces/Agents';
import { AlgorithmData } from '../../interfaces/AlgorithmData';
import { SM } from '../../abstract-classes/SM';

@Injectable({
  providedIn: 'root',
})
export class EgsStableMarriageService extends SM {
  breakAssignment(man: Man, woman: Woman) {
    this.saveStep(4, { '%woman%': woman.name });
    if (woman.match.length < 1) {
      this.saveStep(6, { '%woman%': woman.name });
      return;
    }

    const match = woman.match[0];

    if (
      match.ranking.filter((agent) => agent.match[0] != man).length > 0 &&
      !this.freeAgents.includes(match) &&
      match.ranking.length > 0
    ) {
      this.freeAgents.push(match);
    }

    this.removeLine(match, woman, 'green');
    this.stylePrefsMutual(match, woman, 'grey');

    this.saveStep(5, {
      '%woman%': woman.name,
      '%currentPartner%': match.name,
    });

    const matchRank = this.getRank(woman, match);
    woman.ranking.splice(matchRank, 1);
    match.ranking.splice(this.getRank(match, woman), 1);
  }

  provisionallyAssign(agent: Man, woman: Woman) {
    this.changeLineColour(agent, woman, 'red', 'green');
    this.stylePrefsMutual(agent, woman, 'green');

    this.saveStep(7, {
      '%man%': agent.name,
      '%woman%': woman.name,
    });

    woman.match[0] = agent;
    agent.match.push(woman);
  }

  removeRuledOutPrefs(agent: Man, woman: Woman) {
    this.saveStep(8, {
      '%man%': agent.name,
      '%woman%': woman.name,
    });

    const agentRank = this.getRank(woman, agent);
    for (let i = agentRank + 1; i < woman.ranking.length; i++) {
      const reject = woman.ranking[i];
      const womanRank = this.getRank(reject, woman);
      this.relevantPrefs.push(this.utils.getAsChar(reject));

      this.saveStep(9, {
        '%nextWorstMan%': reject.name,
        '%woman%': woman.name,
      });

      this.stylePrefsMutual(reject, woman, 'grey');

      this.saveStep(10, {
        '%nextWorstMan%': reject.name,
        '%woman%': woman.name,
      });

      reject.ranking.splice(womanRank, 1);
      woman.ranking.splice(i, 1);
      i--;

      this.relevantPrefs.pop();
    }

    this.saveStep(11, {
      '%man%': agent.name,
      '%woman%': woman.name,
    });
  }

  getNextWoman(man: Man): Woman {
    return man.ranking[0];
  }

  match(): AlgorithmData {
    this.saveStep(1);

    while (this.freeAgents.length > 0) {
      const man = this.freeAgents[0];
      this.freeAgents.shift();

      if (man.ranking.length > 0 && !!this.getNextWoman(man)) {
        this.saveStep(2, { '%man%': man.name });

        const woman = this.getNextWoman(man);

        this.saveStep(3, {
          '%man%': man.name,
          '%woman%': woman.name,
        });

        this.breakAssignment(man, woman);
        this.provisionallyAssign(man, woman);
        this.removeRuledOutPrefs(man, woman);
      }
    }

    this.selectedAgents = [];
    this.relevantPrefs = [];
    this.saveStep(12);
    return;
  }
}
