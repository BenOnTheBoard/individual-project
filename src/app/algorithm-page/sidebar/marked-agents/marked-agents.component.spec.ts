import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MarkedAgentsComponent } from './marked-agents.component';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval/algorithm-retrieval.service';
import { PlaybackService } from '../../services/playback/playback.service';
import { AgentFactory } from 'src/app/algorithms/interfaces/Agents';

describe('FreeAgentsComponent', () => {
  let component: MarkedAgentsComponent;
  let fixture: ComponentFixture<MarkedAgentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MarkedAgentsComponent],
      providers: [
        {
          provide: PlaybackService,
          useValue: {
            commandList: [
              {
                algorithmSpecificData: {
                  markedAgents: [
                    AgentFactory.createTiedHospital('hospitalA', 2),
                  ],
                },
              },
            ],
            stepCounter: 0,
          },
        },
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
