import { inject, Injectable } from '@angular/core';
import { Algorithm } from './Algorithm';
import { HrResidentEgsService } from '../algorithms/algorithm-services/hr-resident-egs/hr-resident-egs.service';
import { EgsStableMarriageService } from '../algorithms/algorithm-services/smp-man-egs/egs-stable-marriage.service';
import { GsStableMarriageService } from '../algorithms/algorithm-services/smp-man-gs/gs-stable-marriage.service';
import { StableRoomIrvService } from '../algorithms/algorithm-services/smp-room-irv/stable-room-irv.service';
import { HrHospitalEgsService } from '../algorithms/algorithm-services/hr-hospital-egs/hr-hospital-egs.service';
import { SpaStudentEgsService } from '../algorithms/algorithm-services/spa-stu-egs/spa-student-egs.service';
import { SMTSuperService } from '../algorithms/algorithm-services/smt-super/smt-super.service';

import { spasStudentConfig } from './algorithm-configs/spas-student.config';
import { srPersonConfig } from './algorithm-configs/sr-person.config';
import { hrHospitalConfig } from './algorithm-configs/hr-hospital.config';
import { hrResidentConfig } from './algorithm-configs/hr-resident.config';
import { smManEGSConfig } from './algorithm-configs/sm-man-egs.config';
import { smManGSConfig } from './algorithm-configs/sm-man-gs.config';
import { smtSuperManConfig } from './algorithm-configs/smt-super-man.config';
import { hrtSuperResConfig } from './algorithm-configs/hrt-super-res.config';
import { HrtSuperResService } from '../algorithms/algorithm-services/hrt-super-res/hrt-super-res.service';

@Injectable({
  providedIn: 'root',
})
export class AlgorithmRetrievalService {
  public currentAlgorithm: Algorithm;
  public numberOfG1Agents = 5;
  public numberOfG2Agents = 5;

  // Algorithm Injections
  protected gsStableMarriageService = inject(GsStableMarriageService);
  protected egsStableMarriageService = inject(EgsStableMarriageService);
  protected hrResidentEgsService = inject(HrResidentEgsService);
  protected hrHospitalEgsService = inject(HrHospitalEgsService);
  protected stableRoomIrvService = inject(StableRoomIrvService);
  protected spaStudentEgsService = inject(SpaStudentEgsService);
  //Ties
  protected smtSuperService = inject(SMTSuperService);
  protected hrtSuperResService = inject(HrtSuperResService);

  #mapOfAvailableAlgorithms = new Map<String, Algorithm>();
  #possiblyUnstableAlgs = ['smp-room-irv', 'smt-super-man', 'hrt-super-res'];
  #marksAgents = ['hrt-super-res'];

  #irregularPluralMap: Map<string, string> = new Map([
    ['Man', 'Men'],
    ['Woman', 'Women'],
    ['Person', 'People'],
  ]);

  constructor() {
    this.#mapOfAvailableAlgorithms
      .set(
        'smp-man-gs',
        smManGSConfig.service(this.gsStableMarriageService).build(),
      )
      .set(
        'smp-man-egs',
        smManEGSConfig.service(this.egsStableMarriageService).build(),
      )
      .set(
        'hr-resident-egs',
        hrResidentConfig.service(this.hrResidentEgsService).build(),
      )
      .set(
        'hr-hospital-egs',
        hrHospitalConfig.service(this.hrHospitalEgsService).build(),
      )
      .set(
        'smp-room-irv',
        srPersonConfig.service(this.stableRoomIrvService).build(),
      )
      .set(
        'spa-stu-egs',
        spasStudentConfig.service(this.spaStudentEgsService).build(),
      )
      .set(
        'smt-super-man',
        smtSuperManConfig.service(this.smtSuperService).build(),
      )
      .set(
        'hrt-super-res',
        hrtSuperResConfig.service(this.hrtSuperResService).build(),
      );
  }

  getListOfAlgorithms(): Array<Algorithm> {
    return Array.from(this.#mapOfAvailableAlgorithms.values());
  }

  getAlgorithm(name: string): Algorithm {
    return this.#mapOfAvailableAlgorithms.get(name);
  }

  getSide(proposing: boolean, plural: boolean, id?: string): string {
    const alg = id ? this.getAlgorithm(id) : this.currentAlgorithm;
    const side = alg.orientation[proposing ? 0 : 1];
    if (!plural) return side;
    return this.#irregularPluralMap.get(side) ?? `${side}s`;
  }

  mayBeUnstable(id: string) {
    return this.#possiblyUnstableAlgs.includes(id);
  }

  marksAgents(id: string) {
    return this.#marksAgents.includes(id);
  }
}
