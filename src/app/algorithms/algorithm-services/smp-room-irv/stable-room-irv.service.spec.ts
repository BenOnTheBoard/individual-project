import { TestBed } from '@angular/core/testing';

import { StableRoomIrvService } from './stable-room-irv.service';

describe('StableRoomIrvService', () => {
  let service: StableRoomIrvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StableRoomIrvService);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('test correctness x 1000 (smp-room-irv)', () => {
    let stable: boolean = true;
    for (let i = 0; i < 1000; i++) {
      let agentCount: number = Math.floor(Math.random() * 4 + 1) * 2;

      service.run(agentCount, agentCount, undefined);
      if (!service.stable) {
        stable = false;
      }
    }

    expect(stable).toBeTrue();
  });
});
