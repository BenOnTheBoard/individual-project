import { TestBed } from '@angular/core/testing';

import { HrtSuperResService } from './hrt-super-res.service';

describe('HrtSuperRes', () => {
  let service: HrtSuperResService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrtSuperResService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
