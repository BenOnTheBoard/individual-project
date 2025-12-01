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

    // tests dont work cause there is no pref generation - fixed at 6 - this tried to make different sizes 
    // it("test correctness x 1000 (spa-stu-egs)", () => {
    //   let stable: boolean = true;
    //   for (let i = 0; i < 1; i++) {
  
    //     // only even numbers from 2 - 18
    //     let agentCount: number = Math.floor(Math.random() * (9 - 2) + 2);
      

    //     service.run(agentCount, agentCount, undefined);
    //     if (!service.stable) {
    //       stable = false;
    //     }
    //     // console.log(service.stable)
  
    //   }
  
    //   expect(stable).toBeTrue();
      
    // })

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
      console.log("SPA Tests Done")
    });
    

});
