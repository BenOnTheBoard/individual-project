import { Injectable } from '@angular/core';
import { SMT } from '../../abstract-classes/problem-definitions/SMT';
import { TiedMan, TiedWoman } from '../../interfaces/Agents';

@Injectable({
  providedIn: 'root',
})
export class SMTSuperService extends SMT {
  assign(man: TiedMan, woman: TiedWoman): void {
    this.changeLineColour(man, woman, 'red', 'green');
    this.stylePrefsMutual(man, woman, 'green');
    super.assign(man, woman);
  }

  breakAssignment(man: TiedMan, woman: TiedWoman): void {
    this.removeLine(man, woman, 'green');
    super.breakAssignment(man, woman);
    if (man.match.length == 0 && !this.freeAgents.includes(man)) {
      this.freeAgents.push(man);
    }
  }

  delete(man: TiedMan, woman: TiedWoman): void {
    this.stylePrefsMutual(man, woman, 'grey');
    super.delete(man, woman);
    if (this.freeAgents.includes(man) && this.hasEmptyList(man)) {
      this.freeAgents.splice(this.freeAgents.indexOf(man), 1);
    }
  }

  getNextFreeAgent(): TiedMan {
    const man = this.freeAgents[0];
    this.freeAgents.shift();
    return man;
  }

  allEngaged(): boolean {
    return [...this.group1Agents.values()].every((man) => man.match.length > 0);
  }

  canHalt(): boolean {
    const someEmpty = [...this.group1Agents.values()].some((man) =>
      this.hasEmptyList(man),
    );
    console.log(someEmpty, this.allEngaged());
    return someEmpty || this.allEngaged();
  }

  removeSuccessors(man: TiedMan, woman: TiedWoman): void {
    this.saveStep(6, this.packageStepVars(man, woman));
    const succ = this.getStrictSuccessors<TiedMan>(woman, man);
    for (const reject of succ) {
      this.saveStep(7, this.packageStepVars(reject, woman));
      if (woman.match.includes(reject)) {
        this.saveStep(8, this.packageStepVars(reject, woman));
        this.breakAssignment(reject, woman);
      }
      this.saveStep(9, this.packageStepVars(reject, woman));
      this.delete(reject, woman);
    }
  }

  breakAllAssignments(woman: TiedWoman): void {
    while (woman.match.length != 0) {
      const match = woman.match[0];
      this.saveStep(12, this.packageStepVars(match, woman));
      this.breakAssignment(match, woman);
    }
  }

  applyToHead(man: TiedMan): void {
    const head = this.getHead<TiedWoman>(man);
    console.log(head);
    for (const f of head) {
      console.log(man, f);
    }
    this.saveStep(4, this.packageStepVars(man));

    for (const woman of head) {
      this.addLine(man, woman, 'red');
      this.saveStep(5, this.packageStepVars(man, woman));
      this.assign(man, woman);
      this.removeSuccessors(man, woman);
    }
  }

  deleteTail(woman: TiedWoman): void {
    this.saveStep(13, this.packageStepVars(null, woman));
    const tail = this.getTail<TiedMan>(woman);
    for (const reject of tail) {
      this.saveStep(14, this.packageStepVars(reject, woman));
      this.delete(reject, woman);
    }
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
      }

      for (const woman of this.group2Agents.values()) {
        if (woman.match.length < 2) continue;
        this.selectedAgents.push(this.utils.getAsChar(woman));
        this.saveStep(10, this.packageStepVars(null, woman));
        this.breakAllAssignments(woman);
        this.deleteTail(woman);
        this.selectedAgents.pop();
      }
      this.saveStep(15);
    } while (!this.canHalt());

    this.saveStep(16);
    if (this.allEngaged()) {
      this.saveStep(17);
    } else {
      this.saveStep(18);
    }
  }
}
