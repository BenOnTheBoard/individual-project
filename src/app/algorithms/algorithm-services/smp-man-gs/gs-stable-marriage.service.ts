import { Injectable } from '@angular/core';
import { Man, Woman } from '../../interfaces/Agents';
import { AlgorithmData } from '../../interfaces/AlgorithmData';
import { SM } from '../../abstract-classes/problem-definitions/SM';

@Injectable({
  providedIn: 'root',
})
export class GsStableMarriageService extends SM {
  incrementLastProposed(man: Man): void {
    const rank = this.getOriginalRank(man, man.lastProposed, 'group1');
    if (rank + 1 < man.ranking.length) {
      man.lastProposed = man.ranking[rank + 1];
    }
  }

  #saveStepTwo(man: Man) {
    const manChar = this.utils.getAsChar(man);
    this.relevantPrefs.push(manChar);
    this.selectedAgents.push(manChar);
    this.saveStep(2, this.packageStepVars(man));
  }

  #saveStepThree(man: Man, woman: Woman) {
    const womanChar = this.utils.getAsChar(woman);
    this.relevantPrefs.push(womanChar);
    this.selectedAgents.push(womanChar);
    this.addLine(man, woman, 'red');
    this.stylePrefsMutual(man, woman, 'red');
    this.saveStep(3, this.packageStepVars(man, woman));
  }

  #saveStepFive(man: Man, woman: Woman) {
    this.changeLineColour(man, woman, 'red', 'green');
    this.stylePrefsMutual(man, woman, 'green');
    this.saveStep(5, this.packageStepVars(man, woman));
  }

  #saveStepSix(man: Man, woman: Woman, match: Man) {
    this.relevantPrefs.push(this.utils.getAsChar(match));
    this.saveStep(6, this.packageStepVars(man, woman, match));
  }

  #saveStepSeven(man: Man, woman: Woman, match: Man) {
    this.stylePrefs('group2', woman, man, 'red');
    this.saveStep(7, this.packageStepVars(man, woman, match));
  }

  #saveStepEight(man: Man, woman: Woman, match: Man) {
    this.stylePrefsMutual(match, woman, 'grey');
    this.stylePrefsMutual(man, woman, 'green');
    this.changeLineColour(man, woman, 'red', 'green');
    this.removeLine(match, woman, 'green');
    this.saveStep(8, this.packageStepVars(man, woman, match));
  }

  #saveStepNine(man: Man, woman: Woman, match: Man) {
    this.stylePrefsMutual(man, woman, 'grey');
    this.removeLine(man, woman, 'red');
    this.saveStep(9, this.packageStepVars(man, woman, match));
  }

  #engage(man: Man, woman: Woman) {
    woman.match[0] = man;
    man.match[0] = woman;
  }

  match(): AlgorithmData {
    for (const man of Array.from(this.group1Agents.values())) {
      man.lastProposed = man.ranking[0];
    }

    this.saveStep(1);

    while (this.freeAgents.length > 0) {
      this.selectedAgents = [];
      this.relevantPrefs = [];
      const man = this.freeAgents[0];
      const woman = man.lastProposed;
      const match = woman.match[0];
      this.#saveStepTwo(man);
      this.#saveStepThree(man, woman);

      this.incrementLastProposed(man);
      this.saveStep(4, { '%woman%': woman.name });

      if (woman.match.length <= 0) {
        this.#engage(man, woman);
        this.freeAgents.shift();
        this.#saveStepFive(man, woman);
      } else {
        this.#saveStepSix(man, woman, match);
        this.#saveStepSeven(man, woman, match);

        if (this.getRank(woman, match) > this.getRank(woman, man)) {
          this.#engage(man, woman);
          this.freeAgents.push(match);
          this.freeAgents.shift();
          this.#saveStepEight(man, woman, match);
        } else {
          this.#saveStepNine(man, woman, match);
          this.saveStep(10);
        }
      }
    }

    this.selectedAgents = [];
    this.relevantPrefs = [];
    this.saveStep(11);
    return;
  }
}
