import { Injectable } from '@angular/core';
import { HRT } from '../../abstract-classes/problem-definitions/HRT';
import { TiedHospital, TiedResident } from '../../interfaces/Agents';

@Injectable({
  providedIn: 'root',
})
export class HrtSuperResService extends HRT {
  freeAgents: Array<TiedResident>;
  fullHospitals: Array<TiedHospital>;

  assign(res: TiedResident, hos: TiedHospital): void {
    this.changeLineColour(res, hos, 'red', 'green');
    this.stylePrefsMutual(res, hos, 'green');
    super.assign(res, hos);
  }

  breakAssignment(res: TiedResident, hos: TiedHospital): void {
    this.removeLine(res, hos, 'green');
    super.breakAssignment(res, hos);
    if (res.match.length == 0 && !this.freeAgents.includes(res)) {
      this.freeAgents.push(res);
    }
  }

  delete(res: TiedResident, hos: TiedHospital): void {
    this.stylePrefsMutual(res, hos, 'grey');
    super.delete(res, hos);
    if (this.freeAgents.includes(res) && this.hasEmptyList(res)) {
      this.freeAgents.splice(this.freeAgents.indexOf(res), 1);
    }
  }

  getNextFreeAgent(): TiedResident {
    const man = this.freeAgents[0];
    this.freeAgents.shift();
    return man;
  }

  deleteTail(hos: TiedHospital) {
    const tail = this.getTail<TiedResident>(hos);
    for (const reject of tail) {
      if (hos.match.includes(reject)) {
        this.breakAssignment(reject, hos);
      }
      this.delete(reject, hos);
    }
  }

  deleteBelowWorst(hos: TiedHospital) {
    const worst = this.getWorstResident(hos);
    const succ = this.getStrictSuccessors<TiedResident>(hos, worst);
    for (const reject of succ) {
      this.delete(reject, hos);
    }
  }

  match(): void {
    while (this.freeAgents.length > 0) {
      const res = this.getNextFreeAgent();
      const head = this.getHead<TiedHospital>(res);
      for (const hos of head) {
        this.assign(res, hos);
        if (hos.match.length > hos.capacity) {
          this.deleteTail(hos);
        }
        if (hos.match.length == hos.capacity) {
          this.fullHospitals.push(hos);
          this.deleteBelowWorst(hos);
        }
      }
    }
  }
}
