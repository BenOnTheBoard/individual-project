import { TestBed } from '@angular/core/testing';

import { SMTSuperService } from './smt-super.service';

describe('EgsStableMarriageService', () => {
  let service: SMTSuperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SMTSuperService);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });
});
