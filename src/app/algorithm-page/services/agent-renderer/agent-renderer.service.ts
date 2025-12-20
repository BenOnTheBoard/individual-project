import { Injectable } from '@angular/core';
import { AlgorithmRetrievalService } from '../../../algorithm-retrieval.service';
import { LayoutService } from '../layout/layout.service';
import { TextRendererService } from '../text-renderer/text-renderer.service';
import { ColourHexService } from '../colour-hex.service';

@Injectable({
  providedIn: 'root',
})
export class AgentRendererService {
  private readonly radius = 30;
  private readonly selectionBorderWidth = 4;
  private readonly defaultBorderWidth = 1;

  private readonly groupOneColour = 'orange';
  private readonly groupTwoColour = 'purple';
  private readonly selectionColour = 'green';

  private ctx: CanvasRenderingContext2D;

  constructor(
    public algService: AlgorithmRetrievalService,
    public layoutService: LayoutService,
    public textRenderer: TextRendererService,
    public colourHexService: ColourHexService
  ) {}

  public setContext(ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx;
  }

  public drawCircle(x: number, y: number, strokeOnly: boolean): void {
    this.ctx.strokeStyle = this.colourHexService.getHex('black');
    this.ctx.lineWidth = this.defaultBorderWidth;

    this.ctx.beginPath();
    this.ctx.arc(x, y, this.radius, 0, Math.PI * 2);
    if (!strokeOnly) {
      this.ctx.fill();
    }
    this.ctx.stroke();
  }

  public drawGroup(
    agentCount: number,
    labelGenerator: (i: number) => string,
    fillStyle: string
  ): void {
    this.ctx.fillStyle = fillStyle;
    this.textRenderer.setFontSize(this.radius);
    const offset = (this.radius * Math.sqrt(2)) / 4;

    console.log(agentCount);
    for (let i = 0; i < agentCount; i++) {
      console.log(i);
      const label = labelGenerator(i);
      const [x, y] = this.layoutService.getPositionOfAgent('circle' + label);
      this.drawCircle(x, y, false);
      this.textRenderer.drawText(label, x - offset, y + offset);
    }
  }

  public drawGroupOneAgents(): void {
    this.drawGroup(
      this.algService.numberOfGroup1Agents,
      (i: number) => String(i + 1),
      this.colourHexService.getHex(this.groupOneColour)
    );
  }

  public drawGroupTwoAgents(): void {
    this.drawGroup(
      this.algService.numberOfGroup2Agents,
      (i: number) => String.fromCharCode(65 + i),
      this.colourHexService.getHex(this.groupTwoColour)
    );
  }

  public selectCircles(circles: string[]) {
    let originalLineWidth: number = this.ctx.lineWidth;
    let originalStrokeStyle: string | CanvasGradient | CanvasPattern =
      this.ctx.strokeStyle;

    this.ctx.lineWidth = this.selectionBorderWidth;
    this.ctx.strokeStyle = this.colourHexService.getHex(this.selectionColour);

    for (let label of circles) {
      const [x, y] = this.layoutService.getPositionOfAgent('circle' + label);
      this.drawCircle(x, y, true);
    }

    this.ctx.lineWidth = originalLineWidth;
    this.ctx.strokeStyle = originalStrokeStyle;
  }
}
