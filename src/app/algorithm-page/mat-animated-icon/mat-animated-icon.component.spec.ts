import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { MatAnimatedIconComponent } from './mat-animated-icon.component';

describe('MatAnimatedIconComponent', () => {
  let component: MatAnimatedIconComponent;
  let fixture: ComponentFixture<MatAnimatedIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, MatAnimatedIconComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatAnimatedIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
