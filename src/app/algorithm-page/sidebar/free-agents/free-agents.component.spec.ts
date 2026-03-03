import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FreeAgentsComponent } from './free-agents.component';
import { mockPlaybackService } from 'src/app/mock-services/playback.mock';
import { mockAlgorithmRetrievalService } from 'src/app/mock-services/algorithm-retrieval.mock';

describe('FreeAgentsComponent', () => {
  let component: FreeAgentsComponent;
  let fixture: ComponentFixture<FreeAgentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FreeAgentsComponent],
      providers: [mockPlaybackService, mockAlgorithmRetrievalService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
