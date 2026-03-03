import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MarkedAgentsComponent } from './marked-agents.component';
import { mockPlaybackService } from 'src/app/mock-services/playback.mock';
import { mockAlgorithmRetrievalService } from 'src/app/mock-services/algorithm-retrieval.mock';

describe('MarkedAgentsComponent', () => {
  let component: MarkedAgentsComponent;
  let fixture: ComponentFixture<MarkedAgentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MarkedAgentsComponent],
      providers: [mockPlaybackService, mockAlgorithmRetrievalService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkedAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
