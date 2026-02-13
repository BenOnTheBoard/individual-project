import { TestBed } from '@angular/core/testing';

import { GsStableMarriageService } from './gs-stable-marriage.service';

describe('GsStableMarriageService', () => {
  let service: GsStableMarriageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GsStableMarriageService);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('test correctness x10000 (smp-man-gs)', () => {
    let stable: boolean = true;
    for (let i = 0; i < 1000; i++) {
      const agentCount = Math.floor(Math.random() * (9 - 2) + 2);
      service.run(agentCount, agentCount, undefined);
      if (!service.isStable()) stable = false;
    }
    expect(stable).toBeTrue();
  });
});
