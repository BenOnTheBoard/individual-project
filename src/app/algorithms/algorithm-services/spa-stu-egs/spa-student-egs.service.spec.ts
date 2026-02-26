import { TestBed } from '@angular/core/testing';
import { SpaStudentEgsService } from './spa-student-egs.service';

const instanceCount = 600;

describe('SpaStudentEgsService', () => {
  let service: SpaStudentEgsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpaStudentEgsService);
  });

  it(`produces stable solutions x${instanceCount}`, () => {
    let stable = true;
    for (let i = 0; i < instanceCount; i++) {
      const agent1Count = Math.floor(Math.random() * (10 - 2) + 2);
      const agent2Count = Math.floor(Math.random() * (10 - 2) + 2);
      service.run(agent1Count, agent2Count);
      if (!service.isStable()) stable = false;
    }
    expect(stable).toBeTrue();
  });
});
