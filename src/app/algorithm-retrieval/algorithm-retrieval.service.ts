import { inject, Injectable } from '@angular/core';
import { Algorithm } from './Algorithm';
import { HrResidentEgsService } from '../algorithms/algorithm-services/hr-resident-egs/hr-resident-egs.service';
import { EgsStableMarriageService } from '../algorithms/algorithm-services/smp-man-egs/egs-stable-marriage.service';
import { GsStableMarriageService } from '../algorithms/algorithm-services/smp-man-gs/gs-stable-marriage.service';
import { StableRoomIrvService } from '../algorithms/algorithm-services/smp-room-irv/stable-room-irv.service';
import { HrHospitalEgsService } from '../algorithms/algorithm-services/hr-hospital-egs/hr-hospital-egs.service';
import { SpaStudentEgsService } from '../algorithms/algorithm-services/spa-stu-egs/spa-student-egs.service';
import { spasStudentConfig } from './algorithm-configs/spas-student';
import { srPersonConfig } from './algorithm-configs/sr-person.config';
import { hrHospitalConfig } from './algorithm-configs/hr-hospital.config';
import { hrResidentConfig } from './algorithm-configs/hr-resident.config';
import { smManEGSConfig } from './algorithm-configs/sm-man-egs';
import { smManGSConfig } from './algorithm-configs/sm-man-gs.config';

@Injectable({
  providedIn: 'root',
})
export class AlgorithmRetrievalService {
  public currentAlgorithm: Algorithm;
  public numberOfGroup1Agents: number = 5;
  public numberOfGroup2Agents: number = 5;

  // Algorithm Injections
  protected gsStableMarriageService = inject(GsStableMarriageService);
  protected egsStableMarriageService = inject(EgsStableMarriageService);
  protected hrResidentEgsService = inject(HrResidentEgsService);
  protected hrHospitalEgsService = inject(HrHospitalEgsService);
  protected stableRoomIrvService = inject(StableRoomIrvService);
  protected spaStudentEgsService = inject(SpaStudentEgsService);

  #mapOfAvailableAlgorithms = new Map<String, Algorithm>();

  #pluralMap: Map<string, string> = new Map([
    ['Man', 'Men'],
    ['Woman', 'Women'],
    ['Resident', 'Residents'],
    ['Hospital', 'Hospitals'],
    ['Person', 'People'],
    ['Student', 'Students'],
    ['Project', 'Projects'],
    ['Lecturer', 'Lecturers'],
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
      );
  }

  getListOfAlgorithms(): Array<Algorithm> {
    return Array.from(this.#mapOfAvailableAlgorithms.values());
  }

  getAlgorithm(name: string): Algorithm {
    return this.#mapOfAvailableAlgorithms.get(name);
  }

  getSide(proposing: boolean, plural: boolean): string {
    const sideDigit = proposing ? 0 : 1;
    const side = this.currentAlgorithm.orientation[sideDigit];
    if (plural) {
      return this.#pluralMap.get(side);
    }
    return side;
  }
}
