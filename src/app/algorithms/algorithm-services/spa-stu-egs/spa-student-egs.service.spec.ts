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
    let stable: boolean = true;
    for (let i = 0; i < 1000; i++) {
      let agent1Count: number = Math.floor(Math.random() * (10 - 2) + 2);
      let agent2Count: number = Math.floor(Math.random() * (10 - 2) + 2);

      service.run(agent1Count, agent2Count, undefined);
      if (!service.stable) {
        stable = false;
      }
    }

    expect(stable).toBeTrue();
    console.log('SPA Tests Done');
  });
});
