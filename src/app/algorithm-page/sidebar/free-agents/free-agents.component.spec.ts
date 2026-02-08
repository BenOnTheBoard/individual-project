import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FreeAgentsComponent } from './free-agents.component';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval/algorithm-retrieval.service';
import { PlaybackService } from '../../services/playback/playback.service';

describe('FreeAgentsComponent', () => {
  let component: FreeAgentsComponent;
  let fixture: ComponentFixture<FreeAgentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FreeAgentsComponent],
      providers: [
        {
          provide: PlaybackService,
          useValue: {
            commandList: [{ freeAgents: [] }],
            stepCounter: 0,
          },
        },
        {
          provide: AlgorithmRetrievalService,
          useValue: {
            currentAlgorithm: {
              orientation: ['Man', 'Woman'],
            },
            pluralMap: new Map([
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
    fixture = TestBed.createComponent(FreeAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
