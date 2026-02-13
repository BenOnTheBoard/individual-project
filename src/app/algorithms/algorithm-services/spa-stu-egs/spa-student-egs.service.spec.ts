import { TestBed } from '@angular/core/testing';

import { SpaStudentEgsService } from './spa-student-egs.service';

describe('SpaStudentEgsService', () => {
  let service: SpaStudentEgsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpaStudentEgsService);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('test correctness x10000 (hr-resident-egs)', () => {
    let stable = true;
    for (let i = 0; i < 1000; i++) {
      const agent1Count = Math.floor(Math.random() * (10 - 2) + 2);
      const agent2Count = Math.floor(Math.random() * (10 - 2) + 2);
      service.run(agent1Count, agent2Count, undefined);
      if (!service.isStable()) stable = false;
    }
    expect(stable).toBeTrue();
  });
});
