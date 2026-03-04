import { TestBed } from '@angular/core/testing';
import { StableRoomIrvService } from './stable-room-irv.service';
import { UtilsService } from 'src/app/utils/utils.service';

const instanceCount = 600;

describe('StableRoomIrvService', () => {
  let service: StableRoomIrvService;
  let utils: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StableRoomIrvService);
    utils = TestBed.inject(UtilsService);
  });

  it(`only outputs matching as stable if it is x${instanceCount}`, () => {
    let pass = true;
    let i = 0;
    while (i < instanceCount) {
      const agentCounts = utils.getRandomAgentCounts(true);
      service.runSingleInstance(...agentCounts);
      if (service.isStable() && !service.checkStability()) pass = false;
      i++;
    }
    expect(pass).toBeTrue();
  });
});
