import { TestBed } from '@angular/core/testing';
import { HrHospitalEgsService } from './hr-hospital-egs.service';

const instanceCount = 600;

describe('HrHospitalRgsService', () => {
  let service: HrHospitalEgsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrHospitalEgsService);
  });

  it(`produces stable solutions x${instanceCount}`, () => {
    let stable = true;
    for (let i = 0; i < instanceCount; i++) {
      const agent1Count = Math.floor(Math.random() * (9 - 2) + 2);
      const agent2Count = Math.floor(Math.random() * (9 - 2) + 2);
      service.run(agent1Count, agent2Count);
      if (!service.isStable()) stable = false;
    }
    expect(stable).toBeTrue();
  });
});
