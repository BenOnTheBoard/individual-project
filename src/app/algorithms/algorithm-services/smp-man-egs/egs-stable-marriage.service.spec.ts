import { TestBed } from '@angular/core/testing';
import { EgsStableMarriageService } from './egs-stable-marriage.service';

const instanceCount = 600;

describe('EgsStableMarriageService', () => {
  let service: EgsStableMarriageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EgsStableMarriageService);
  });

  it(`produces stable solutions x${instanceCount}`, () => {
    let stable = true;
    for (let i = 0; i < instanceCount; i++) {
      const agentCount = Math.floor(Math.random() * (9 - 2) + 2);
      service.run(agentCount);
      if (!service.isStable()) stable = false;
    }
    expect(stable).toBeTrue();
  });
});
