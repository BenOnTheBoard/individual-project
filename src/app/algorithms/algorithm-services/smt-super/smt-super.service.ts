import { Injectable } from '@angular/core';
import { SMT } from '../../abstract-classes/problem-definitions/SMT';
import { TiedMan, TiedWoman } from '../../interfaces/Agents';

@Injectable({
  providedIn: 'root',
})
export class SMTSuperService extends SMT {
  assign(man: TiedMan, woman: TiedWoman) {
    this.changeLineColour(man, woman, 'red', 'green');
    this.stylePrefsMutual(man, woman, 'green');
    woman.match.push(man);
    man.match.push(woman);
  }

  breakAssignment(man: TiedMan, woman: TiedWoman) {
    this.removeLine(man, woman, 'green');
    const womanIdx = woman.match.indexOf(man);
    const manIdx = man.match.indexOf(woman);
    if (womanIdx == -1 || manIdx == -1) {
      throw Error(`assignment d.n.e. : ${man.name}, ${woman.name}`);
    }
    woman.match.splice(womanIdx, 1);
    man.match.splice(manIdx, 1);

    if (man.match.length == 0 && !this.freeAgents.includes(man)) {
      this.freeAgents.push(man);
    }
  }

  delete(man: TiedMan, woman: TiedWoman) {
    this.stylePrefsMutual(man, woman, 'grey');
    const manTie = woman.ranking[this.getRank(woman, man)];
    const womanTie = man.ranking[this.getRank(man, woman)];
    manTie.splice(this.getIdxInTie(manTie, man), 1);
    womanTie.splice(this.getIdxInTie(womanTie, woman), 1);

    if (this.freeAgents.includes(man) && this.hasEmptyList(man)) {
      this.freeAgents.splice(this.freeAgents.indexOf(man), 1);
    }
  }

  getNextFreeAgent(): TiedMan {
    const man = this.freeAgents[0];
    this.freeAgents.shift();
    return man;
  }

  getHead(man: TiedMan): Array<TiedWoman> {
    for (const tie of man.ranking) {
      if (tie.length > 0) {
        return tie.slice();
      }
    }
    throw Error(`tried to get head of empty list: ${man.name}`);
  }

  getTail(woman: TiedWoman): Array<TiedMan> {
    for (const tie of woman.ranking.slice().reverse()) {
      if (tie.length > 0) {
        return tie.slice();
      }
    }
    throw Error(`tried to get tail of empty list: ${woman.name}`);
  }

  getStrictSuccessors(woman: TiedWoman, match: TiedMan): Array<TiedMan> {
    return woman.ranking
      .slice(this.getRank(woman, match) + 1)
      .reduce(
        (arr: Array<TiedMan>, tie: Array<TiedMan>) => arr.concat(...tie),
        [],
      );
  }

  hasEmptyList(man: TiedMan): boolean {
    for (const tie of man.ranking) {
      if (tie.length > 0) {
        return false;
      }
    }
    return true;
  }

  allEngaged(): boolean {
    return [...this.group1Agents.values()].every((man) => man.match.length > 0);
  }

  canHalt(): boolean {
    const someEmpty = [...this.group1Agents.values()].some((man) =>
      this.hasEmptyList(man),
    );
    return someEmpty || this.allEngaged();
  }

  removeSuccessors(man: TiedMan, woman: TiedWoman): void {
    this.saveStep(6, this.packageStepVars(man, woman));
    for (const reject of this.getStrictSuccessors(woman, man)) {
      this.saveStep(7, this.packageStepVars(reject, woman));
      if (woman.match.includes(reject)) {
        this.saveStep(8, this.packageStepVars(reject, woman));
        this.breakAssignment(reject, woman);
      }
      this.saveStep(10, this.packageStepVars(reject, woman));
      this.delete(reject, woman);
    }
    this.saveStep(11, this.packageStepVars(null, woman));
  }

  breakAllAssignments(woman: TiedWoman): void {
    while (woman.match.length != 0) {
      const match = woman.match[0];
      this.saveStep(16, this.packageStepVars(match, woman));
      this.breakAssignment(match, woman);
    }
    this.saveStep(17, this.packageStepVars(null, woman));
  }

  applyToHead(man: TiedMan): void {
    const head = this.getHead(man);
    this.saveStep(4, this.packageStepVars(man));

    for (const woman of head) {
      this.addLine(man, woman, 'red');
      this.saveStep(5, this.packageStepVars(man, woman));
      this.assign(man, woman);
      this.removeSuccessors(man, woman);
    }
  }

  deleteTail(woman: TiedWoman): void {
    this.saveStep(18, this.packageStepVars(null, woman));
    for (const reject of this.getTail(woman)) {
      this.saveStep(19, this.packageStepVars(reject, woman));
      this.delete(reject, woman);
    }
    this.saveStep(20, this.packageStepVars(null, woman));
  }

  match(): void {
    this.saveStep(1);
    do {
      while (this.freeAgents.length > 0) {
        const man = this.getNextFreeAgent();
        this.selectedAgents.push(this.utils.getAsChar(man));
        this.saveStep(3, this.packageStepVars(man));
        this.applyToHead(man);
        this.selectedAgents.pop();
        this.saveStep(12, this.packageStepVars(man));
      }
      this.saveStep(13);
      for (const woman of this.group2Agents.values()) {
        if (woman.match.length < 2) continue;
        this.selectedAgents.push(this.utils.getAsChar(woman));
        this.saveStep(14, this.packageStepVars(null, woman));
        this.breakAllAssignments(woman);
        this.deleteTail(woman);
        this.selectedAgents.pop();
      }
      this.saveStep(21);
      this.saveStep(22);
    } while (!this.canHalt());
    this.saveStep(23);

    if (this.allEngaged()) {
      this.saveStep(24);
    } else {
      this.saveStep(26);
    }
  }
}
