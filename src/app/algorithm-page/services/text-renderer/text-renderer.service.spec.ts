import { TestBed } from '@angular/core/testing';
import { TextRendererService } from './text-renderer.service';

describe('TextRendererService', () => {
  let service: TextRendererService;
  let mockCtx: jasmine.SpyObj<CanvasRenderingContext2D>;

  beforeEach(() => {
    mockCtx = jasmine.createSpyObj('CanvasRenderingContext2D', [
      'save',
      'restore',
      'fillText',
      'translate',
      'measureText',
    ]);
    mockCtx.measureText.and.returnValue({ width: 10 } as TextMetrics);

    TestBed.configureTestingModule({});
    service = TestBed.inject(TextRendererService);
    service.setContext(mockCtx);
    service.setFontSize(20);
  });

  it('should draw simple text', () => {
    service.drawText('Hello', 10, 20);
    expect(mockCtx.fillStyle).toBe('#000000');
    expect(mockCtx.translate).toHaveBeenCalledWith(10, 20);
    expect(mockCtx.fillText).toHaveBeenCalledWith('Hello', 0, 0);
  });

  it('should write in specified colours', () => {
    service.drawText('Test', 0, 0, 'red');
    expect(mockCtx.fillStyle).toBe('#EB2A2A');
  });

  it('should handle newlines', () => {
    service.setFontSize(16);
    service.drawTextFromState('Line1\nLine2', {
      colour: '#000000',
      x: 50,
      y: 100,
    });
    expect(mockCtx.translate).toHaveBeenCalledTimes(2);
    expect(mockCtx.fillText).toHaveBeenCalledWith('Line1', 0, 0);
    expect(mockCtx.translate).toHaveBeenCalledWith(50, 100);
    expect(mockCtx.fillText).toHaveBeenCalledWith('Line2', 0, 0);
    expect(mockCtx.translate).toHaveBeenCalledWith(50, 120);
  });

  it('should parse internal bracketed hex colors', () => {
    service.setFontSize(16);
    service.drawTextFromState('Text {#FF0000}red', {
      colour: '#000000',
      x: 0,
      y: 0,
    });
    expect(mockCtx.fillStyle).toHaveBeenCalledWith('#FF0000');
  });
});
