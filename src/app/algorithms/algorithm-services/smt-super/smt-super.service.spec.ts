import { TestBed } from '@angular/core/testing';
import { SMTSuperService } from './smt-super.service';

const instanceCount = 600;

describe('SMTSuperService', () => {
  let service: SMTSuperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SMTSuperService);
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
