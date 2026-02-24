import { inject, Injectable } from '@angular/core';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval/algorithm-retrieval.service';
import { LayoutService } from '../layout/layout.service';
import { TextRendererService } from '../text-renderer/text-renderer.service';
import { ColourHexService } from 'src/app/utils/colour-hex.service';
import { Position } from 'src/app/utils/position';

@Injectable({
  providedIn: 'root',
})
export class AgentRendererService {
  readonly #radius = 30;
  readonly #selectionBorderWidth = 4;
  readonly #defaultBorderWidth = 1;

  readonly #groupOneColour = 'orange';
  readonly #groupTwoColour = 'purple';
  readonly #selectionColour = 'green';

  #ctx: CanvasRenderingContext2D;

  protected algRetriever = inject(AlgorithmRetrievalService);
  protected layoutService = inject(LayoutService);
  protected textRenderer = inject(TextRendererService);
  protected colourHexService = inject(ColourHexService);

  public setContext(ctx: CanvasRenderingContext2D): void {
    this.#ctx = ctx;
  }

  public getRadiusOfCircles(): number {
    return this.#radius;
  }

  public drawCircle(pos: Position, strokeOnly: boolean): void {
    if (!strokeOnly) {
      this.#ctx.strokeStyle = this.colourHexService.getHex('black');
      this.#ctx.lineWidth = this.#defaultBorderWidth;
    }

    this.#ctx.beginPath();
    this.#ctx.arc(pos.x, pos.y, this.#radius, 0, Math.PI * 2);
    if (!strokeOnly) this.#ctx.fill();
    this.#ctx.stroke();
  }

  public drawGroup(
    agentCount: number,
    labelGenerator: (i: number) => string,
    fillStyle: string,
  ): void {
    this.#ctx.fillStyle = fillStyle;
    this.textRenderer.setFontSize(this.#radius);

    for (let i = 0; i < agentCount; i++) {
      const label = labelGenerator(i);
      const centrePos = this.layoutService.getPositionOfAgent(`circle${label}`);
      const textPos = {
        x: centrePos.x - 0.5 * this.#ctx.measureText(label).width,
        y: centrePos.y + (this.#radius * Math.sqrt(2)) / 4,
      };
      this.drawCircle(centrePos, false);
      this.textRenderer.drawText(label, textPos);
    }
  }

  public drawGroupOneAgents(): void {
    this.drawGroup(
      this.algRetriever.numberOfG1Agents,
      (i: number) => String(i + 1),
      this.colourHexService.getHex(this.#groupOneColour),
    );
  }

  public drawGroupTwoAgents(): void {
    this.drawGroup(
      this.algRetriever.numberOfG2Agents,
      (i: number) => String.fromCharCode(65 + i),
      this.colourHexService.getHex(this.#groupTwoColour),
    );
  }

  public selectCircles(circles: Array<string>) {
    this.#ctx.lineWidth = this.#selectionBorderWidth;
    this.#ctx.strokeStyle = this.colourHexService.getHex(this.#selectionColour);

    for (const label of circles) {
      const pos = this.layoutService.getPositionOfAgent(`circle${label}`);
      this.drawCircle(pos, true);
    }
  }
}
