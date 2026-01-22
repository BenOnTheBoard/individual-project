import { Injectable } from '@angular/core';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
import { Position } from 'src/app/utils/position';
import { UtilsService } from 'src/app/utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private readonly yMargin = 0.15;
  private readonly xMargin = 0.3;
  private readonly canvasYOffset = 40;
  private readonly centreXOffsetPercentage = 0.15;
  private readonly hospitalCapacityOffset = 35;
  private readonly heightOffsetMap = new Map<number, number>([
    [8, 8],
    [9, 6],
  ]);
  private readonly SRRadius = 200;

  private positions: Record<string, Position> = {};

  constructor(
    public algService: AlgorithmRetrievalService,
    public utils: UtilsService,
  ) {}

  public getPositions(): Record<string, Position> {
    return this.positions;
  }

  public getPositionOfAgent(agent: string): Position {
    const position = this.positions[agent];
    if (!position) {
      throw new Error(`Position not found for agent: ${agent}`);
    }
    return position;
  }

  private setCirclePosition(
    group: 'LHS' | 'RHS' | 'SR',
    index: number,
    pos: Position,
  ): void {
    let key: string;
    if (group == 'LHS' || group == 'SR') {
      key = 'circle' + index;
    } else if (group == 'RHS') {
      key = 'circle' + String.fromCharCode(index + 64);
    }
    this.positions[key] = { x: pos.x, y: pos.y };
  }

  private getCanvasMetrics(canvas: HTMLCanvasElement): {
    effectiveWidth: number;
    effectiveHeight: number;
    canvasMiddle: number;
    centre: Position;
  } {
    const { width, height } = canvas;
    const effectiveHeight = height * (1 - this.yMargin);
    const effectiveWidth = width * (1 - this.xMargin);
    const canvasMiddle = effectiveHeight / 2 + this.canvasYOffset;
    const centre = {
      x: effectiveWidth / 2 + width * this.centreXOffsetPercentage,
      y: effectiveHeight / 2,
    };

    return {
      effectiveWidth,
      effectiveHeight,
      canvasMiddle,
      centre,
    };
  }

  public calculateBipartitePositions(
    canvas: HTMLCanvasElement,
    currentCommand: Object,
  ): void {
    const LHSHeightOffset =
      this.heightOffsetMap.get(this.algService.numberOfGroup1Agents) || 0;
    const RHSHeightOffset =
      this.heightOffsetMap.get(this.algService.numberOfGroup2Agents) || 0;

    const { effectiveWidth, effectiveHeight, canvasMiddle, centre } =
      this.getCanvasMetrics(canvas);

    const LHSCircleSpacing =
      effectiveHeight / this.algService.numberOfGroup1Agents + LHSHeightOffset;
    const RHSCircleSpacing =
      effectiveHeight / this.algService.numberOfGroup2Agents + RHSHeightOffset;

    const LHSPosX = currentCommand['algorithmSpecificData']['hospitalCapacity']
      ? canvas.width * this.xMargin - this.hospitalCapacityOffset
      : canvas.width * this.xMargin;
    const RHSPosX = effectiveWidth;

    const middleIdxLHS = (this.algService.numberOfGroup1Agents - 1) / 2;
    const middleIdxRHS = (this.algService.numberOfGroup2Agents - 1) / 2;

    // reset
    this.positions = {
      middle: { x: centre.x, y: centre.y },
    };

    for (let i = 0; i < this.algService.numberOfGroup1Agents; i++) {
      const offset = i - middleIdxLHS;
      const newPos = {
        x: LHSPosX,
        y: canvasMiddle + offset * LHSCircleSpacing,
      };
      this.setCirclePosition('LHS', i + 1, newPos);
    }

    for (let i = 0; i < this.algService.numberOfGroup2Agents; i++) {
      const offset = i - middleIdxRHS;
      const newPos = {
        x: RHSPosX,
        y: canvasMiddle + offset * RHSCircleSpacing,
      };
      this.setCirclePosition('RHS', i + 1, newPos);
    }
  }

  public calculateSRPositions(canvas: HTMLCanvasElement): void {
    const { canvasMiddle, centre } = this.getCanvasMetrics(canvas);
    const origin = { x: centre.x, y: canvasMiddle };
    const spacingAngle = (Math.PI * 2) / this.algService.numberOfGroup1Agents;

    // reset
    this.positions = {
      middle: { x: centre.x, y: centre.y },
    };

    for (let i = 0; i < this.algService.numberOfGroup1Agents; i++) {
      const pos = this.utils.polarToCartesian(
        this.SRRadius,
        spacingAngle * (i + 2),
        origin,
      );
      this.setCirclePosition('SR', i + 1, pos);
    }
  }
}
