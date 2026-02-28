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
    hos.match.push(res);
    res.match.push(hos);
  }

  breakAssignment(res: TiedResident, hos: TiedHospital): void {
    this.removeLine(res, hos, 'green');
    const hosIdx = hos.match.indexOf(res);
    const resIdx = res.match.indexOf(hos);
    if (hosIdx == -1 || resIdx == -1) {
      throw Error(`assignment d.n.e. : ${res.name}, ${hos.name}`);
    }
    hos.match.splice(hosIdx, 1);
    res.match.splice(resIdx, 1);

    if (res.match.length == 0 && !this.freeAgents.includes(res)) {
      this.freeAgents.push(res);
    }
  }

  delete(res: TiedResident, hos: TiedHospital): void {
    this.stylePrefsMutual(res, hos, 'grey');
    const resTie = hos.ranking[this.getRank(hos, res)];
    const hosTie = res.ranking[this.getRank(res, hos)];
    resTie.splice(this.getIdxInTie(resTie, res), 1);
    hosTie.splice(this.getIdxInTie(hosTie, hos), 1);

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
    const tail = this.getTail(hos) as Array<TiedResident>;
    for (const reject of tail) {
      if (hos.match.includes(reject)) {
        this.breakAssignment(reject, hos);
      }
      this.delete(reject, hos);
    }
  }

  deleteBelowWorst(hos: TiedHospital) {
    const worst = this.getWorstResident(hos);
    const succ = this.getStrictSuccessors(hos, worst) as Array<TiedResident>;
    for (const reject of succ) {
      this.delete(reject, hos);
    }
  }

  match(): void {
    while (this.freeAgents.length > 0) {
      const res = this.getNextFreeAgent();
      const head = this.getHead(res) as Array<TiedHospital>;
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
