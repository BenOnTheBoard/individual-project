import { TestBed } from '@angular/core/testing';
import { GsStableMarriageService } from './gs-stable-marriage.service';
import { UtilsService } from 'src/app/utils/utils.service';

const instanceCount = 600;

describe('GsStableMarriageService', () => {
  let service: GsStableMarriageService;
  let utils: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GsStableMarriageService);
    utils = TestBed.inject(UtilsService);
  });

  it(`only outputs matching as stable if it is x${instanceCount}`, () => {
    let pass = true;
    let i = 0;
    while (i < instanceCount) {
      const agentCounts = utils.getRandomAgentCounts(true);
      service.runSingleInstance(...agentCounts);
      if (!service.checkStability()) pass = false;
      i++;
    }
    expect(pass).toBeTrue();
  });
});
