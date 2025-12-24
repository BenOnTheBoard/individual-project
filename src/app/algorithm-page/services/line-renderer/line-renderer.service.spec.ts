import { TestBed } from '@angular/core/testing';
import { LayoutService } from '../layout/layout.service';
import { ColourHexService } from '../colour-hex.service';
import { LineRendererService } from './line-renderer.service';

describe('LineRendererService', () => {
  let service: LineRendererService;
  let mockCtx: jasmine.SpyObj<CanvasRenderingContext2D>;
  let mockLayoutService: jasmine.SpyObj<LayoutService>;
  let mockColourHex: jasmine.SpyObj<ColourHexService>;

  beforeEach(() => {
    mockCtx = jasmine.createSpyObj('CanvasRenderingContext2D', [
      'beginPath',
      'moveTo',
      'lineTo',
      'stroke',
      'lineWidth',
      'strokeStyle',
    ]);
    mockLayoutService = jasmine.createSpyObj('LayoutService', [
      'getPositionOfAgent',
    ]);
    mockColourHex = jasmine.createSpyObj('ColourHexService', ['getHex']);

    TestBed.configureTestingModule({
      providers: [
        LineRendererService,
        { provide: LayoutService, useValue: mockLayoutService },
        { provide: ColourHexService, useValue: mockColourHex },
      ],
    });

    service = TestBed.inject(LineRendererService);
    service.setContext(mockCtx);

    mockLayoutService.getPositionOfAgent
      .withArgs('circle1')
      .and.returnValue([0, 0]);
    mockLayoutService.getPositionOfAgent
      .withArgs('circleA')
      .and.returnValue([100, 100]);
  });

  it('draws a line when withArrow is false', () => {
    mockColourHex.getHex.and.returnValue('#000000');

    service.drawLine(['1', 'A', 'black'], false);

    expect(mockCtx.beginPath).toHaveBeenCalledTimes(1);
    expect(mockCtx.moveTo).toHaveBeenCalledWith(0, 0);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(100, 100);
    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  it('draws an arrow when withArrow is true', () => {
    mockColourHex.getHex.and.returnValue('#EB2A2A');

    service.drawLine(['1', 'A', 'red'], true);

    expect(mockCtx.beginPath).toHaveBeenCalledTimes(1);
    expect(mockCtx.moveTo).toHaveBeenCalledWith(0, 0);
    expect(mockCtx.moveTo).toHaveBeenCalledTimes(3);
    expect(mockCtx.lineTo).toHaveBeenCalledTimes(3);
    expect(mockCtx.stroke).toHaveBeenCalled();
  });
});
