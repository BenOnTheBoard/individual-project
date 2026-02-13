import { TestBed } from '@angular/core/testing';

import { HrHospitalEgsService } from './hr-hospital-egs.service';

describe('HrHospitalRgsService', () => {
  let service: HrHospitalEgsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrHospitalEgsService);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('test correctness x1000 (hr-hospital-egs)', () => {
    let stable = true;
    for (let i = 0; i < 1000; i++) {
      const agent1Count = Math.floor(Math.random() * (9 - 2) + 2);
      const agent2Count = Math.floor(Math.random() * (9 - 2) + 2);
      service.run(agent1Count, agent2Count, undefined);
      if (!service.isStable()) stable = false;
    }
    expect(stable).toBeTrue();
  });
});
