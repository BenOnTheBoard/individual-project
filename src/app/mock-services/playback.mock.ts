import { AgentFactory } from 'src/app/algorithms/interfaces/Agents';
import { PlaybackService } from '../algorithm-page/services/playback/playback.service';
import { StepBuilder } from 'src/app/algorithms/interfaces/Step';

const mockAgent = AgentFactory.createTiedHospital('hospitalA', 2);
const mockStep = new StepBuilder()
  .freeAgents([mockAgent])
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
  .algorithmData({
    markedAgents: [mockAgent],
  })
  .build();

const playbackMethodSpies = jasmine.createSpyObj<PlaybackService>([
  'restart',
  'backStep',
  'toggle',
  'forwardStep',
  'onSliderChange',
  'setAlgorithm',
]);

export const mockPlaybackService = {
  provide: PlaybackService,
  useValue: {
    commandList: [mockStep],
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
      descriptions: ['placeholder'],
    },
    stepCounter: 0,
    previousStepCounter: 0,
    pause: true,
    getCurrentStep: jasmine
      .createSpy('getCurrentStep')
      .and.returnValue(mockStep),
    ...playbackMethodSpies,
  },
};
