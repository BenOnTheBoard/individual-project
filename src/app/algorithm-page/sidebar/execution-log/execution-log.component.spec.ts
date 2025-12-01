import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlaybackService } from '../../services/playback/playback.service';

import { ExecutionLogComponent } from './execution-log.component';

describe('ExecutionLogComponent', () => {
  let component: ExecutionLogComponent;
  let fixture: ComponentFixture<ExecutionLogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ExecutionLogComponent],
      providers: [
        {
          provide: PlaybackService,
          useValue: {
            commandList: [
              {
                lineNumber: 0,
                freeAgents: [],
                matches: new Map(),
                stepVariables: {},
                group1CurrentPreferences: new Map<string, string[]>([
                  ['1', ['A', 'B', 'C']],
                  ['2', ['B', 'A', 'C']],
                  ['3', ['C', 'A', 'B']],
                ]),
                group2CurrentPreferences: new Map<string, string[]>([
                  ['A', ['1', '2', '3']],
                  ['B', ['2', '1', '3']],
                  ['C', ['3', '1', '2']],
                ]),
                currentlySelectedAgents: [],
                currentLines: [],
                algorithmSpecificData: {},
                relevantPreferences: [],
              },
            ],
            algorithmData: {
              numberOfGroup1Agents: 3,
              numberOfGroup2Agents: 3,
              currentAlgorithm: {
                id: 'smp-man-egs',
                name: 'Stable Marriage Problem',
                orientation: ['Man', 'Woman'],
                equalGroups: true,
              },
              pluralMap: new Map([
                ['Man', 'Men'],
                ['Woman', 'Women'],
              ]),
              descriptions: [],
            },
            stepCounter: 0,
            previousStepCounter: 0,
            setAlgorithm: jasmine.createSpy('setAlgorithm'),
          },
        },
      ],
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
