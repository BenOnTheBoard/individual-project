import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlaybackService } from '../../services/playback/playback.service';
import { ExecutionLogComponent } from './execution-log.component';
import { StepBuilder } from 'src/app/algorithms/interfaces/Step';

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
              new StepBuilder()
                .group1Prefs(
                  new Map([
                    ['1', ['A', 'B', 'C']],
                    ['2', ['B', 'A', 'C']],
                    ['3', ['C', 'A', 'B']],
                  ]),
                )
                .group2Prefs(
                  new Map([
                    ['A', ['1', '2', '3']],
                    ['B', ['2', '1', '3']],
                    ['C', ['3', '1', '2']],
                  ]),
                )
                .build(),
            ],
            algorithmData: {
              numberOfG1Agents: 3,
              numberOfG2Agents: 3,
              currentAlgorithm: {
                id: 'smp-man-egs',
                name: 'Stable Marriage Problem',
                orientation: ['Man', 'Woman'],
                equalGroups: true,
              },
              irregularPluralMap: new Map([
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
