import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MarkedAgentsComponent } from './marked-agents.component';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval/algorithm-retrieval.service';
import { mockPlaybackService } from 'src/app/mock-services/playback.mock';

describe('MarkedAgentsComponent', () => {
  let component: MarkedAgentsComponent;
  let fixture: ComponentFixture<MarkedAgentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MarkedAgentsComponent],
      providers: [
        mockPlaybackService,
        {
          provide: AlgorithmRetrievalService,
          useValue: {
            currentAlgorithm: {
              orientation: ['Man', 'Woman'],
            },
            irregularPluralMap: new Map([
              ['Man', 'Men'],
              ['Woman', 'Women'],
            ]),
            getSide: jasmine.createSpy('getSide'),
          },
        },
      ],
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
