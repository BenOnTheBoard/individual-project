import { Injectable } from '@angular/core';
import { SMT } from '../../abstract-classes/problem-definitions/SMT';
import { TiedMan, TiedWoman } from '../../interfaces/Agents';

@Injectable({
  providedIn: 'root',
})
export class SMTSuperService extends SMT {
  assign(man: TiedMan, woman: TiedWoman) {
    woman.match.push(man);
    man.match.push(woman);
  }

  breakAssignment(man: TiedMan, woman: TiedWoman) {
    const womanIdx = woman.match.indexOf(man);
    const manIdx = man.match.indexOf(woman);
    if (womanIdx == -1 || manIdx == -1) {
      throw Error(`assignment d.n.e. : ${man.name}, ${woman.name}`);
    }
    woman.match.splice(womanIdx, 1);
    man.match.splice(manIdx, 1);

    if (man.match.length == 0) {
      this.freeAgents.push(man);
    }
  }

  delete(man: TiedMan, woman: TiedWoman) {
    const manTie = woman.ranking[this.getRank(woman, man)];
    const womanTie = man.ranking[this.getRank(man, woman)];
    manTie.splice(manTie.indexOf(man), 1);
    womanTie.splice(womanTie.indexOf(man), 1);
  }

  getNextFreeAgent(): TiedMan {
    const man = this.freeAgents[0];
    this.freeAgents.shift();
    return man;
  }

  getHead(man: TiedMan): Array<TiedWoman> {
    for (const tie of man.ranking) {
      if (tie.length > 0) {
        return tie;
      }
    }
    throw Error(`tried to get head of empty list: ${man.name}`);
  }

  getTail(woman: TiedWoman): Array<TiedMan> {
    for (const tie of woman.ranking.slice().reverse()) {
      if (tie.length > 0) {
        return tie;
      }
    }
    throw Error(`tried to get tail of empty list: ${woman.name}`);
  }

  getStrictSuccessors(woman: TiedWoman, match: TiedMan): Array<TiedMan> {
    return woman.ranking.slice(this.getRank(woman, match) + 1).flat();
  }

  isEmptyList(man: TiedMan): boolean {
    for (const tie of man.ranking) {
      if (tie.length > 0) {
        return false;
      }
    }
    return true;
  }

  canHalt(): boolean {
    const someEmpty = [...this.group1Agents.values()].some((man) =>
      this.isEmptyList(man),
    );
    const allEngaged = [...this.group1Agents.values()].every(
      (man) => man.match.length > 0,
    );
    return someEmpty || allEngaged;
  }

  match(): void {
    do {
      while (this.freeAgents.length > 0) {
        const man = this.getNextFreeAgent();
        const head = this.getHead(man);
        for (const woman of head) {
          this.assign(man, woman);
          for (const reject of this.getStrictSuccessors(woman, man)) {
            if (woman.match.includes(reject)) {
              this.breakAssignment(reject, woman);
            }
            this.delete(reject, woman);
          }
        }
      }
      for (const woman of this.group2Agents.values()) {
        if (woman.match.length < 2) continue;
        while (woman.match.length != 0) {
          const match = woman.match[0];
          this.breakAssignment(match, woman);
        }
        for (const reject of this.getTail(woman)) {
          this.delete(reject, woman);
        }
      }
    } while (!this.canHalt());
  }
}
