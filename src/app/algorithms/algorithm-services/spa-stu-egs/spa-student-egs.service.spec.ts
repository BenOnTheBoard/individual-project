import { TestBed } from '@angular/core/testing';
import { SpaStudentEgsService } from './spa-student-egs.service';
import { UtilsService } from 'src/app/utils/utils.service';

const instanceCount = 600;

describe('SpaStudentEgsService', () => {
  let service: SpaStudentEgsService;
  let utils: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpaStudentEgsService);
    utils = TestBed.inject(UtilsService);
  });

  it(`only outputs matching as stable if it is x${instanceCount}`, () => {
    let pass = true;
    let i = 0;
    while (i < instanceCount) {
      const agentCounts = utils.getRandomAgentCounts(false);
      service.runSingleInstance(...agentCounts);
      if (service.isStable()) {
        if (!service.checkStability()) pass = false;
        i++;
      }
    }
    expect(pass).toBeTrue();
  });
});
