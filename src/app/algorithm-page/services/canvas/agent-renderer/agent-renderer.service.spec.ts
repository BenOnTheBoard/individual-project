import { TestBed } from '@angular/core/testing';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
import { LayoutService } from '../layout/layout.service';
import { TextRendererService } from '../text-renderer/text-renderer.service';
import { ColourHexService } from 'src/app/utils/colour-hex.service';
import { AgentRendererService } from './agent-renderer.service';

describe('AgentRendererService', () => {
  let service: AgentRendererService;
  let mockCtx: jasmine.SpyObj<CanvasRenderingContext2D>;
  let mockalgRetriever: Partial<AlgorithmRetrievalService>;
  let mockLayoutService: jasmine.SpyObj<LayoutService>;
  let mockTextRenderer: jasmine.SpyObj<TextRendererService>;
  let mockColourHex: jasmine.SpyObj<ColourHexService>;

  beforeEach(() => {
    mockCtx = jasmine.createSpyObj(
      'CanvasRenderingContext2D',
      [
        'beginPath',
        'arc',
        'fill',
        'stroke',
        'fillStyle',
        'lineWidth',
        'measureText',
        'strokeStyle',
      ],
      {
        measureText: jasmine
          .createSpy('measureText')
          .and.returnValue({ width: 0 }),
      },
    );
    mockalgRetriever = {
      numberOfGroup1Agents: 2,
      numberOfGroup2Agents: 2,
    } as AlgorithmRetrievalService;
    mockLayoutService = jasmine.createSpyObj('LayoutService', [
      'getPositionOfAgent',
    ]);
    mockTextRenderer = jasmine.createSpyObj('TextRendererService', [
      'setFontSize',
      'drawText',
    ]);
    mockColourHex = jasmine.createSpyObj('ColourHexService', ['getHex']);

    mockLayoutService.getPositionOfAgent.and.returnValue({ x: 100, y: 200 });
    mockTextRenderer.setFontSize.and.callFake((size: number) => {});

    TestBed.configureTestingModule({
      providers: [
        AgentRendererService,
        { provide: AlgorithmRetrievalService, useValue: mockalgRetriever },
        { provide: LayoutService, useValue: mockLayoutService },
        { provide: TextRendererService, useValue: mockTextRenderer },
        { provide: ColourHexService, useValue: mockColourHex },
      ],
    });

    service = TestBed.inject(AgentRendererService);
    service.setContext(mockCtx);
  });

  it('should draw a circle and fill when strokeOnly is false', () => {
    service.drawCircle({ x: 100, y: 200 }, false);
    expect(mockCtx.fill).toHaveBeenCalled();
  });

  it('should draw a circle without fill when strokeOnly is true', () => {
    service.drawCircle({ x: 100, y: 200 }, true);
    expect(mockCtx.fill).not.toHaveBeenCalled();
  });

  it('should draw group one agents with number labels', () => {
    service.drawGroupOneAgents();

    expect(mockLayoutService.getPositionOfAgent).toHaveBeenCalledTimes(2);
    expect(mockLayoutService.getPositionOfAgent).toHaveBeenCalledWith(
      'circle1',
    );
    expect(mockLayoutService.getPositionOfAgent).toHaveBeenCalledWith(
      'circle2',
    );
    expect(mockCtx.stroke).toHaveBeenCalledTimes(2);
    expect(mockTextRenderer.drawText).toHaveBeenCalledTimes(2);
  });

  it('should draw group two agents with letter labels', () => {
    service.drawGroupTwoAgents();

    expect(mockLayoutService.getPositionOfAgent).toHaveBeenCalledTimes(2);
    expect(mockLayoutService.getPositionOfAgent).toHaveBeenCalledWith(
      'circleA',
    );
    expect(mockLayoutService.getPositionOfAgent).toHaveBeenCalledWith(
      'circleB',
    );
    expect(mockCtx.stroke).toHaveBeenCalledTimes(2);
    expect(mockTextRenderer.drawText).toHaveBeenCalledTimes(2);
  });

  it('should select circles with green border', () => {
    mockCtx.lineWidth = 2;
    mockCtx.strokeStyle = 'black';

    service.selectCircles(['1', '2']);

    expect(mockLayoutService.getPositionOfAgent).toHaveBeenCalledTimes(2);
    expect(mockLayoutService.getPositionOfAgent).toHaveBeenCalledWith(
      'circle1',
    );
    expect(mockLayoutService.getPositionOfAgent).toHaveBeenCalledWith(
      'circle2',
    );
    expect(mockCtx.stroke).toHaveBeenCalledTimes(2);
    expect(mockCtx.fill).not.toHaveBeenCalled();
  });
});
