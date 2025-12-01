import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnimationContainerComponent } from './animation-container.component';

describe('AnimationContainerComponent', () => {
  let component: AnimationContainerComponent;
  let fixture: ComponentFixture<AnimationContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AnimationContainerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
