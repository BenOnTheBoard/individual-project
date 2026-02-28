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

  getHead(res: TiedResident): Array<TiedHospital> {
    for (const tie of res.ranking) {
      if (tie.length > 0) {
        return tie.slice();
      }
    }
    throw Error(`tried to get head of empty list: ${res.name}`);
  }

  getTail(hos: TiedHospital): Array<TiedResident> {
    for (const tie of hos.ranking.slice().reverse()) {
      if (tie.length > 0) {
        return tie.slice();
      }
    }
    throw Error(`tried to get tail of empty list: ${hos.name}`);
  }

  getStrictSuccessors(
    hos: TiedHospital,
    match: TiedResident,
  ): Array<TiedResident> {
    return hos.ranking
      .slice(this.getRank(hos, match) + 1)
      .reduce(
        (arr: Array<TiedResident>, tie: Array<TiedResident>) =>
          arr.concat(...tie),
        [],
      );
  }

  hasEmptyList(res: TiedResident): boolean {
    for (const tie of res.ranking) {
      if (tie.length > 0) {
        return false;
      }
    }
    return true;
  }

  deleteTail(hos: TiedHospital) {
    for (const reject of this.getTail(hos)) {
      if (hos.match.includes(reject)) {
        this.breakAssignment(reject, hos);
      }
      this.delete(reject, hos);
    }
  }

  deleteBelowWorst(hos: TiedHospital) {
    const worst = this.getWorstResident(hos);
    for (const reject of this.getStrictSuccessors(hos, worst)) {
      this.delete(reject, hos);
    }
  }

  match(): void {
    while (this.freeAgents.length > 0) {
      const res = this.getNextFreeAgent();
      for (const hos of this.getHead(res)) {
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
