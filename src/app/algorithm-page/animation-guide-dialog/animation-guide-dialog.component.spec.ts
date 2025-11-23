import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnimationGuideDialogComponent } from './animation-guide-dialog.component';

describe('AnimationGuideDialogComponent', () => {
  let component: AnimationGuideDialogComponent;
  let fixture: ComponentFixture<AnimationGuideDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimationGuideDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationGuideDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
