import { TestBed } from '@angular/core/testing';
import { StableRoomIrvService } from './stable-room-irv.service';

const instanceCount = 600;

describe('StableRoomIrvService', () => {
  let service: StableRoomIrvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StableRoomIrvService);
  });

  it(`produces stable solutions x${instanceCount}`, () => {
    let stable = true;
    for (let i = 0; i < instanceCount; i++) {
      const agentCount = Math.floor(Math.random() * 4 + 1) * 2;
      service.run(agentCount);
      if (!service.isStable()) stable = false;
    }
    expect(stable).toBeTrue();
  });
});
