import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PseudocodeComponent } from './pseudocode.component';

describe('PseudocodeComponent', () => {
  let component: PseudocodeComponent;
  let fixture: ComponentFixture<PseudocodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PseudocodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PseudocodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
