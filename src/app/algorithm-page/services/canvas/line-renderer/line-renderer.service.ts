import { inject, Injectable } from '@angular/core';
import { LayoutService } from '../layout/layout.service';
import { ColourHexService } from '../../../../utils/colour-hex.service';
import { Position } from 'src/app/utils/position';
import { UtilsService } from 'src/app/utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class LineRendererService {
  readonly #lineWidth = 3;
  readonly #arrowSize = 20;
  readonly #arrowHeadPullback = 35; // diag. px. arrow head shouldn't be under a circle
  readonly #arrowWingAngle = (3 * Math.PI) / 4; // from pointing direction
  #ctx: CanvasRenderingContext2D;

  protected utils = inject(UtilsService);
  protected layoutService = inject(LayoutService);
  protected colourHexService = inject(ColourHexService);

  public setContext(ctx: CanvasRenderingContext2D): void {
    this.#ctx = ctx;
  }

  #prepareContext(colour: string): void {
    this.#ctx.strokeStyle = this.colourHexService.getHex(colour);
    this.#ctx.lineWidth = this.#lineWidth;
  }

  public drawLine(line: Array<string>, withArrow: boolean = false): void {
    const from = this.layoutService.getPositionOfAgent(`circle${line[0]}`);
    const to = this.layoutService.getPositionOfAgent(`circle${line[1]}`);
    const colour = line[2];
    this.#prepareContext(colour);

    this.#ctx.beginPath();
    this.#ctx.moveTo(from.x, from.y);
    if (withArrow && colour != 'green') {
      this.#drawArrowWings(from, to);
    } else {
      this.#ctx.lineTo(to.x, to.y);
    }
    this.#ctx.stroke();
  }

  #drawArrowWings(from: Position, to: Position): void {
    // assumes this.ctx.beginPath was called as in drawLine
    // does not call this.ctx.stroke assuming this is done as in drawLine
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(dy, dx);
    const scalingFactor = this.#arrowHeadPullback / Math.hypot(dx, dy);
    const head: Position = {
      x: to.x - dx * scalingFactor,
      y: to.y - dy * scalingFactor,
    };

    this.#ctx.lineTo(head.x, head.y);
    for (const side of [1, -1]) {
      const theta = angle + side * this.#arrowWingAngle;
      const wingEnd = this.utils.polarToCartesian(this.#arrowSize, theta, head);
      this.#ctx.moveTo(head.x, head.y);
      this.#ctx.lineTo(wingEnd.x, wingEnd.y);
    }
  }
}
