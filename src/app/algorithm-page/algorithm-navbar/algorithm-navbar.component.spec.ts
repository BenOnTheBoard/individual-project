import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlgorithmNavbarComponent } from './algorithm-navbar.component';

describe('AlgorithmNavbarComponent', () => {
  let component: AlgorithmNavbarComponent;
  let fixture: ComponentFixture<AlgorithmNavbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AlgorithmNavbarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgorithmNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
