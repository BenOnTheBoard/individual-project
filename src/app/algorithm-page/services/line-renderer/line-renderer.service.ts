import { Injectable } from '@angular/core';
import { LayoutService } from '../layout/layout.service';
import { ColourHexService } from '../colour-hex.service';

@Injectable({
  providedIn: 'root',
})
export class LineRendererService {
  private readonly lineWidth = 3;
  private readonly arrowSize = 20;
  // arrow head shouldn't be under a circle
  // so we pull it back a little, diag px
  private readonly arrowHeadPullback = 35;
  private ctx: CanvasRenderingContext2D;

  constructor(
    public layoutService: LayoutService,
    public colourHexService: ColourHexService
  ) {}

  public setContext(ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx;
  }

  private prepareContext(colour: string) {
    this.ctx.strokeStyle = this.colourHexService.getHex(colour);
    this.ctx.lineWidth = this.lineWidth;
  }

  drawLine(line: string[], withArrow: boolean = false): void {
    const [fromX, fromY] = this.layoutService.getPositionOfAgent(
      'circle' + line[0]
    );
    const [toX, toY] = this.layoutService.getPositionOfAgent(
      'circle' + line[1]
    );
    const colour: string = line[2];

    this.prepareContext(colour);

    this.ctx.beginPath();
    this.ctx.moveTo(fromX, fromY);
    if (withArrow && colour != 'green') {
      this.drawArrowSegment(fromX, fromY, toX, toY);
    } else {
      this.ctx.lineTo(toX, toY);
    }
    this.ctx.stroke();
  }

  private drawArrowSegment(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
  ): void {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    const scalingFactor = this.arrowHeadPullback / Math.sqrt(dx ** 2 + dy ** 2);
    const headX = toX - dx * scalingFactor;
    const headY = toY - dy * scalingFactor;

    let theta: number;
    let arrowX: number;
    let arrowY: number;

    this.ctx.lineTo(headX, headY);

    for (const side of [1, -1]) {
      theta = angle + (side * (3 * Math.PI)) / 4;
      arrowX = headX + this.arrowSize * Math.cos(theta);
      arrowY = headY + this.arrowSize * Math.sin(theta);
      this.ctx.moveTo(headX, headY);
      this.ctx.lineTo(arrowX, arrowY);
    }
  }
}
