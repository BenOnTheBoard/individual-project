import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

import { PlaybackControlsComponent } from './playback-controls.component';
import { PlaybackService } from '../services/playback/playback.service';

describe('PlaybackControlsComponent', () => {
  let component: PlaybackControlsComponent;
  let fixture: ComponentFixture<PlaybackControlsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, MatSliderModule, PlaybackControlsComponent],
      providers: [
        {
          provide: PlaybackService,
          useValue: {
            stepCounter: 0,
            previousStepCounter: 0,
            pause: true,
            restart: jasmine.createSpy('restart'),
            backStep: jasmine.createSpy('backStep'),
            toggle: jasmine.createSpy('toggle'),
            forwardStep: jasmine.createSpy('forwardStep'),
            onSliderChange: jasmine.createSpy('onSliderChange'),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaybackControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
