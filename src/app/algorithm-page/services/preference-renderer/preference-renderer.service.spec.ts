import { TestBed } from '@angular/core/testing';
import { AlgorithmRetrievalService } from '../../../algorithm-retrieval.service';
import { LayoutService } from '../layout/layout.service';
import { TextRendererService } from '../text-renderer/text-renderer.service';
import { ColourHexService } from '../../../utils/colour-hex.service';
import { AgentRendererService } from '../agent-renderer/agent-renderer.service';
import { PreferenceRendererService } from './preference-renderer.service';
import { Step } from 'src/app/algorithms/interfaces/Step';

describe('PreferenceRendererService', () => {
  let service: PreferenceRendererService;
  let mockCtx: jasmine.SpyObj<CanvasRenderingContext2D>;
  let mockAlgService: Partial<AlgorithmRetrievalService>;
  let mockAgentRenderer: jasmine.SpyObj<AgentRendererService>;
  let mockLayoutService: jasmine.SpyObj<LayoutService>;
  let mockTextRenderer: jasmine.SpyObj<TextRendererService>;
  let mockColourHex: jasmine.SpyObj<ColourHexService>;
  let mockCommand: Step;

  beforeEach(() => {
    mockCtx = jasmine.createSpyObj('CanvasRenderingContext2D', [
      'beginPath',
      'arc',
      'fill',
      'stroke',
      'fillStyle',
      'lineWidth',
      'strokeStyle',
      'measureText',
      'moveTo',
      'lineTo',
    ]);
    mockAlgService = {
      numberOfGroup1Agents: 2,
      numberOfGroup2Agents: 2,
    } as AlgorithmRetrievalService;
    mockAgentRenderer = jasmine.createSpyObj('AgentRendererService', [
      'getRadiusOfCircles',
    ]);
    mockLayoutService = jasmine.createSpyObj('LayoutService', [
      'getPositionOfAgent',
    ]);
    mockTextRenderer = jasmine.createSpyObj('TextRendererService', [
      'setFontSize',
      'drawText',
    ]);
    mockColourHex = jasmine.createSpyObj('ColourHexService', ['getHex']);

    mockCtx.measureText.and.returnValue({ width: 20 } as TextMetrics);
    mockAgentRenderer.getRadiusOfCircles.and.returnValue(30);
    mockLayoutService.getPositionOfAgent.and.returnValue({ x: 100, y: 200 });
    mockTextRenderer.setFontSize.and.callFake((size: number) => {});
    mockCommand = {
      lineNumber: 1,
      freeAgents: [],
      matches: new Map<string, string>(),
      stepVariables: {},
      group1CurrentPreferences: new Map([
        ['1', ['A']],
        ['2', ['B']],
      ]),
      group2CurrentPreferences: new Map([
        ['A', ['1']],
        ['B', ['2']],
      ]),
      currentlySelectedAgents: [],
      currentLines: [],
      algorithmSpecificData: new Object(),
      relevantPreferences: ['1', 'A'],
    } as Step;

    TestBed.configureTestingModule({
      providers: [
        PreferenceRendererService,
        { provide: AlgorithmRetrievalService, useValue: mockAlgService },
        { provide: AgentRendererService, useValue: mockAgentRenderer },
        { provide: LayoutService, useValue: mockLayoutService },
        { provide: TextRendererService, useValue: mockTextRenderer },
        { provide: ColourHexService, useValue: mockColourHex },
      ],
    });

    service = TestBed.inject(PreferenceRendererService);
    service.setContext(mockCtx);
  });

  it('should draw bipartite preferences for both groups', () => {
    service.setCurrentCommand(mockCommand);

    service.drawBipartitePreferences();

    for (let agent of ['circle1', 'circle2', 'circleA', 'circleB']) {
      expect(mockLayoutService.getPositionOfAgent).toHaveBeenCalledWith(agent);
    }
    expect(mockTextRenderer.drawText).toHaveBeenCalledTimes(4);
  });

  it('should draw SR preferences with first half LHS and second half RHS', () => {
    service.setCurrentCommand(mockCommand);

    service.drawSRPreferences();

    for (let agent of ['circle1', 'circle2']) {
      expect(mockLayoutService.getPositionOfAgent).toHaveBeenCalledWith(agent);
    }
    expect(mockTextRenderer.drawText).toHaveBeenCalledTimes(2);
  });

  it('should draw relevant preferences', () => {
    service.setCurrentCommand(mockCommand);
    service.drawRelevantPreferences();

    for (let agent of ['circle1', 'circleA']) {
      expect(mockLayoutService.getPositionOfAgent).toHaveBeenCalledWith(agent);
    }
    expect(mockTextRenderer.drawText).toHaveBeenCalledTimes(2);
  });

  it('should draw capacities when algorithmSpecificData has hospitalCapacity', () => {
    mockCommand.algorithmSpecificData = {
      hospitalCapacity: {
        A: 3,
        B: 2,
      },
    };
    console.log(mockCommand.algorithmSpecificData['hospitalCapacity']);
    service.setCurrentCommand(mockCommand);

    service.drawCapacities();

    for (let agent of ['circleA', 'circleB']) {
      expect(mockLayoutService.getPositionOfAgent).toHaveBeenCalledWith(agent);
    }
    expect(mockTextRenderer.drawText).toHaveBeenCalledTimes(2);
  });

  it('should draw lecturer brackets and text', () => {
    mockCommand.algorithmSpecificData = {
      lecturerProjects: [['projectA', 'projectB']],
      lecturerCapacity: [2],
      lecturerRanking: [['1', '2']],
    };
    console.log(mockCommand);
    service.setCurrentCommand(mockCommand);

    service.drawLecturers();

    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.moveTo).toHaveBeenCalled();
    expect(mockCtx.lineTo).toHaveBeenCalledTimes(3);
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(mockTextRenderer.drawText).toHaveBeenCalledTimes(1);
  });
});
