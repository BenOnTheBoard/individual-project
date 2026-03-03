import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FreeAgentsComponent } from './free-agents.component';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval/algorithm-retrieval.service';
import { PlaybackService } from '../../services/playback/playback.service';
import { AgentFactory } from 'src/app/algorithms/interfaces/Agents';

describe('FreeAgentsComponent', () => {
  let component: FreeAgentsComponent;
  let fixture: ComponentFixture<FreeAgentsComponent>;
  const mockAgent = AgentFactory.createTiedHospital('hospitalA', 2);
  const mockStep = {
    freeAgents: [mockAgent],
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FreeAgentsComponent],
      providers: [
        {
          provide: PlaybackService,
          useValue: {
            commandList: [{ freeAgents: [] }],
            stepCounter: 0,
            getCurrentStep: jasmine
              .createSpy('getCurrentStep')
              .and.returnValue(mockStep),
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
    fixture = TestBed.createComponent(FreeAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
