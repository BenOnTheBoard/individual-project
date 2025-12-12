import { TestBed } from '@angular/core/testing';

import { SmtSuperService } from './smt-super';

describe('SmtSuper', () => {
  let service: SmtSuperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmtSuperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
