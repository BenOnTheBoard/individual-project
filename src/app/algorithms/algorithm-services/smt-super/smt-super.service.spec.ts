import { TestBed } from '@angular/core/testing';
import { SMTSuperService } from './smt-super.service';
import { UtilsService } from 'src/app/utils/utils.service';

const instanceCount = 600;

describe('HrHospitalEgsService', () => {
  let service: SMTSuperService;
  let utils: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SMTSuperService);
    utils = TestBed.inject(UtilsService);
  });

  it(`only outputs matching as stable if it is x${instanceCount}`, () => {
    let pass = true;
    let i = 0;
    while (i < instanceCount) {
      const agentCounts = utils.getRandomAgentCounts(true);
      service.runSingleInstance(...agentCounts);
      if (service.isStable()) {
        if (!service.checkStability()) pass = false;
        i++;
      }
    }
    expect(pass).toBeTrue();
  });
});
