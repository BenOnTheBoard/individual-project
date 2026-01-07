import { Injectable } from '@angular/core';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
import { Position } from 'src/app/utils/position';

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

  constructor(public algService: AlgorithmRetrievalService) {}

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
    x: number,
    y: number
  ) {
    let key: string;
    if (group == 'LHS' || group == 'SR') {
      key = 'circle' + index;
    } else if (group == 'RHS') {
      key = 'circle' + String.fromCharCode(index + 64);
    }
    this.positions[key] = { x: x, y: y };
  }

  private getCanvasMetrics(canvas: HTMLCanvasElement): {
    effectiveWidth: number;
    effectiveHeight: number;
    canvasMiddle: number;
    centreX: number;
    centreY: number;
  } {
    const { width, height } = canvas;
    const effectiveHeight = height * (1 - this.yMargin);
    const effectiveWidth = width * (1 - this.xMargin);
    const canvasMiddle = effectiveHeight / 2 + this.canvasYOffset;
    const centreX = effectiveWidth / 2 + width * this.centreXOffsetPercentage;
    const centreY = effectiveHeight / 2;

    return {
      effectiveWidth,
      effectiveHeight,
      canvasMiddle,
      centreX,
      centreY,
    };
  }

  public calculateBipartitePositions(
    canvas: HTMLCanvasElement,
    currentCommand: Object
  ) {
    const LHSHeightOffset =
      this.heightOffsetMap.get(this.algService.numberOfGroup1Agents) || 0;
    const RHSHeightOffset =
      this.heightOffsetMap.get(this.algService.numberOfGroup2Agents) || 0;

    const { effectiveWidth, effectiveHeight, canvasMiddle, centreX, centreY } =
      this.getCanvasMetrics(canvas);

    const LHSCircleSpacing =
      effectiveHeight / this.algService.numberOfGroup1Agents + LHSHeightOffset;
    const RHSCircleSpacing =
      effectiveHeight / this.algService.numberOfGroup2Agents + RHSHeightOffset;

    // reset
    this.positions = {
      middle: { x: centreX, y: centreY },
    };

    const LHSPosX = currentCommand['algorithmSpecificData']['hospitalCapacity']
      ? canvas.width * this.xMargin - this.hospitalCapacityOffset
      : canvas.width * this.xMargin;
    const RHSPosX = effectiveWidth;

    const middleIdxLHS = (this.algService.numberOfGroup1Agents - 1) / 2;
    const middleIdxRHS = (this.algService.numberOfGroup2Agents - 1) / 2;

    // LHS Positions
    for (let i = 0; i < this.algService.numberOfGroup1Agents; i++) {
      const offset = i - middleIdxLHS;
      const newPosY = canvasMiddle + offset * LHSCircleSpacing;
      this.setCirclePosition('LHS', i + 1, LHSPosX, newPosY);
    }

    // RHS Circles
    for (let i = 0; i < this.algService.numberOfGroup2Agents; i++) {
      const offset = i - middleIdxRHS;
      const newPosY = canvasMiddle + offset * RHSCircleSpacing;
      this.setCirclePosition('RHS', i + 1, RHSPosX, newPosY);
    }
  }

  private polarToCartesian(r: number, theta: number): [number, number] {
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    return [x, y];
  }

  public calculateRoommatePositions(canvas: HTMLCanvasElement) {
    const { canvasMiddle, centreX, centreY } = this.getCanvasMetrics(canvas);

    // reset
    this.positions = {
      middle: { x: centreX, y: centreY },
    };

    const spacingAngle = (Math.PI * 2) / this.algService.numberOfGroup1Agents;

    for (let i = 0; i < this.algService.numberOfGroup1Agents; i++) {
      const [x, y] = this.polarToCartesian(
        this.SRRadius,
        spacingAngle * (i + 2)
      );
      this.setCirclePosition('SR', i + 1, x + centreX, y + canvasMiddle);
    }
  }
}
