import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CanvasDisplayComponent } from './canvas-display.component';

describe('CanvasDisplayComponent', () => {
  let component: CanvasDisplayComponent;
  let fixture: ComponentFixture<CanvasDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
