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

  // added test from smp

  // tests dont work cause there is no pref generation - fixed at 6 - this tried to make different sizes
  it('test correctness x 1000 (smp-room-irv)', () => {
    let stable: boolean = true;
    for (let i = 0; i < 1000; i++) {
      // only even numbers from 2 - 18
      let agentCount: number = Math.floor(Math.random() * 4 + 1) * 2;

      service.run(agentCount, agentCount, undefined);
      if (!service.stable) {
        stable = false;
      }
    }

    expect(stable).toBeTrue();
  });
});
