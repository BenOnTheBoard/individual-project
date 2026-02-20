import { Injectable } from '@angular/core';
import { Man, Woman } from '../../interfaces/Agents';
import { AlgorithmData } from '../../interfaces/AlgorithmData';
import { SM } from '../../abstract-classes/problem-definitions/SM';

@Injectable({
  providedIn: 'root',
})
export class EgsStableMarriageService extends SM {
  #saveStepFive(man: Man, woman: Woman, match: Man): void {
    this.removeLine(match, woman, 'green');
    this.stylePrefsMutual(match, woman, 'grey');
    this.saveStep(5, this.packageStepVars(man, woman));
  }

  #saveStepSeven(man: Man, woman: Woman) {
    this.changeLineColour(man, woman, 'red', 'green');
    this.stylePrefsMutual(man, woman, 'green');
    this.saveStep(7, this.packageStepVars(man, woman));
  }

  #saveStepsNineAndTen(man: Man, woman: Woman) {
    this.relevantPrefs.push(this.utils.getAsChar(man));
    this.saveStep(9, this.packageStepVars(man, woman));
    this.stylePrefsMutual(man, woman, 'grey');
    this.saveStep(10, this.packageStepVars(man, woman));
    this.relevantPrefs.pop();
  }

  breakAssignment(man: Man, woman: Woman) {
    const match = woman.match[0];

    if (
      match.ranking.filter((agent) => agent.match[0] != man).length > 0 &&
      !this.freeAgents.includes(match)
    ) {
      this.freeAgents.push(match);
    }

    this.#saveStepFive(man, woman, match);

    const matchRank = this.getRank(woman, match);
    woman.ranking.splice(matchRank, 1);
    match.ranking.splice(this.getRank(match, woman), 1);
  }

  provisionallyAssign(man: Man, woman: Woman) {
    this.#saveStepSeven(man, woman);
    woman.match[0] = man;
    man.match.push(woman);
  }

  removeRuledOutPrefs(man: Man, woman: Woman) {
    this.saveStep(8, this.packageStepVars(man, woman));

    const agentRank = this.getRank(woman, man);
    for (let i = agentRank + 1; i < woman.ranking.length; i++) {
      const reject = woman.ranking[i];
      const womanRank = this.getRank(reject, woman);

      this.#saveStepsNineAndTen(reject, woman);

      reject.ranking.splice(womanRank, 1);
      woman.ranking.splice(i, 1);
      i--;
    }

    this.saveStep(11, this.packageStepVars(man, woman));
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
        this.saveStep(2, this.packageStepVars(man));
        const woman = this.getNextWoman(man);
        this.saveStep(3, this.packageStepVars(man, woman));

        this.saveStep(4, this.packageStepVars(null, woman));
        if (woman.match.length < 1) {
          this.saveStep(6, this.packageStepVars(null, woman));
        } else {
          this.breakAssignment(man, woman);
        }
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
