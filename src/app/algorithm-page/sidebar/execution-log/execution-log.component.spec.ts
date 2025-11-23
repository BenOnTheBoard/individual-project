import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlaybackService } from '../../services/playback/playback.service';

import { ExecutionLogComponent } from './execution-log.component';

describe('ExecutionLogComponent', () => {
  let component: ExecutionLogComponent;
  let fixture: ComponentFixture<ExecutionLogComponent>;
  let playback: PlaybackService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [ PlaybackService, ExecutionLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionLogComponent);
    component = fixture.componentInstance;
    playback = TestBed.inject(PlaybackService);
    playback.algorithmData["description"] = ["a", "b", "c"];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
