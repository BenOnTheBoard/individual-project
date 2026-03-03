import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ExecutionLogComponent } from './execution-log.component';
import { mockPlaybackService } from 'src/app/mock-services/playback.mock';

describe('ExecutionLogComponent', () => {
  let component: ExecutionLogComponent;
  let fixture: ComponentFixture<ExecutionLogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ExecutionLogComponent],
      providers: [mockPlaybackService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
