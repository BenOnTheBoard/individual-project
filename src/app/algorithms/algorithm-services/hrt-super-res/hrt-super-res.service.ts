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
    this.saveStep(7, this.packageStepVars(null, hos));
    for (const reject of tail) {
      this.saveStep(8, this.packageStepVars(reject, hos));
      if (hos.match.includes(reject)) {
        this.saveStep(9, this.packageStepVars(reject, hos));
        this.breakAssignment(reject, hos);
      }
      this.saveStep(10, this.packageStepVars(reject, hos));
      this.delete(reject, hos);
    }
  }

  deleteBelowWorst(hos: TiedHospital) {
    const worst = this.getWorstResident(hos);
    this.saveStep(13, this.packageStepVars(worst, hos));
    const succ = this.getStrictSuccessors<TiedResident>(hos, worst);
    this.saveStep(14, this.packageStepVars(worst, hos));
    for (const reject of succ) {
      this.saveStep(15, this.packageStepVars(reject, hos));
      this.delete(reject, hos);
    }
  }

  match(): void {
    this.fullHospitals = [];
    this.saveStep(1);
    while (this.freeAgents.length > 0) {
      const res = this.getNextFreeAgent();
      this.selectedAgents.push(this.utils.getAsChar(res));
      this.saveStep(3, this.packageStepVars(res));
      const head = this.getHead<TiedHospital>(res);
      this.saveStep(4, this.packageStepVars(res));
      for (const hos of head) {
        this.selectedAgents.push(this.utils.getAsChar(hos));
        this.addLine(res, hos, 'red');
        this.saveStep(5, this.packageStepVars(res, hos));
        this.assign(res, hos);
        this.saveStep(6, this.packageStepVars(null, hos));
        if (hos.match.length > hos.capacity) {
          this.deleteTail(hos);
        }
        this.saveStep(11, this.packageStepVars(null, hos));
        if (hos.match.length == hos.capacity) {
          this.fullHospitals.push(hos);
          this.saveStep(12, this.packageStepVars(null, hos));
          this.deleteBelowWorst(hos);
        }
        this.selectedAgents.pop();
      }
      this.selectedAgents.pop();
    }
    for (const res of this.group1Agents.values()) {
      if (res.match.length >= 2) {
        this.saveStep(17, this.packageStepVars(res));
        return;
      }
    }
    for (const hos of this.fullHospitals) {
      if (hos.match.length < hos.capacity) {
        this.saveStep(19, this.packageStepVars(null, hos));
        return;
      }
    }
    this.saveStep(20);
  }
}
