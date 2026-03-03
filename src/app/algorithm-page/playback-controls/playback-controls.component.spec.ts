import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

import { PlaybackControlsComponent } from './playback-controls.component';
import { mockPlaybackService } from 'src/app/mock-services/playback.mock';

describe('PlaybackControlsComponent', () => {
  let component: PlaybackControlsComponent;
  let fixture: ComponentFixture<PlaybackControlsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, MatSliderModule, PlaybackControlsComponent],
      providers: [mockPlaybackService],
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
