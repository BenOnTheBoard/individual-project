import { inject, Injectable } from '@angular/core';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval/algorithm-retrieval.service';
import { Step } from 'src/app/algorithms/interfaces/Step';
import { Position } from 'src/app/utils/position';
import { UtilsService } from 'src/app/utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly #yMargin = 0.15;
  readonly #xMargin = 0.3;
  readonly #canvasYOffset = 40;
  readonly #centreXOffsetPercentage = 0.15;
  readonly #hospitalCapacityOffset = 35;
  readonly #heightOffsetMap = new Map<number, number>([
    [8, 8],
    [9, 6],
  ]);
  readonly #SRRadius = 200;

  #positions: Record<string, Position> = {};
  protected algRetriever = inject(AlgorithmRetrievalService);
  protected utils = inject(UtilsService);

  public setPositions(positions): void {
    this.#positions = positions;
  }

  public getPositions(): Record<string, Position> {
    return this.#positions;
  }

  public getPositionOfAgent(agent: string): Position {
    const position = this.#positions[agent];
    if (!position) {
      throw new Error(`Position not found for agent: ${agent}`);
    }
    return position;
  }

  #setCirclePosition(
    group: 'LHS' | 'RHS' | 'SR',
    index: number,
    pos: Position,
  ): void {
    let key: string;
    if (group == 'LHS' || group == 'SR') {
      key = `circle${index}`;
    } else if (group == 'RHS') {
      key = `circle${String.fromCharCode(index + 64)}`;
    }
    this.#positions[key] = { x: pos.x, y: pos.y };
  }

  #getCanvasMetrics(canvas: HTMLCanvasElement): {
    effectiveWidth: number;
    effectiveHeight: number;
    canvasMiddle: number;
    centre: Position;
  } {
    const { width, height } = canvas;
    const effectiveHeight = height * (1 - this.#yMargin);
    const effectiveWidth = width * (1 - this.#xMargin);
    const canvasMiddle = effectiveHeight / 2 + this.#canvasYOffset;
    const centre = {
      x: effectiveWidth / 2 + width * this.#centreXOffsetPercentage,
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
    currentCommand: Step,
  ): void {
    const LHSHeightOffset =
      this.#heightOffsetMap.get(this.algRetriever.numberOfGroup1Agents) || 0;
    const RHSHeightOffset =
      this.#heightOffsetMap.get(this.algRetriever.numberOfGroup2Agents) || 0;

    const { effectiveWidth, effectiveHeight, canvasMiddle, centre } =
      this.#getCanvasMetrics(canvas);

    const LHSCircleSpacing =
      effectiveHeight / this.algRetriever.numberOfGroup1Agents +
      LHSHeightOffset;
    const RHSCircleSpacing =
      effectiveHeight / this.algRetriever.numberOfGroup2Agents +
      RHSHeightOffset;

    const LHSPosX = currentCommand.algorithmSpecificData['hospitalCapacity']
      ? canvas.width * this.#xMargin - this.#hospitalCapacityOffset
      : canvas.width * this.#xMargin;

    const middleIdxLHS = (this.algRetriever.numberOfGroup1Agents - 1) / 2;
    const middleIdxRHS = (this.algRetriever.numberOfGroup2Agents - 1) / 2;

    // reset
    this.#positions = {
      middle: { x: centre.x, y: centre.y },
    };

    for (let i = 0; i < this.algRetriever.numberOfGroup1Agents; i++) {
      const offset = i - middleIdxLHS;
      const newPos = {
        x: LHSPosX,
        y: canvasMiddle + offset * LHSCircleSpacing,
      };
      this.#setCirclePosition('LHS', i + 1, newPos);
    }

    for (let i = 0; i < this.algRetriever.numberOfGroup2Agents; i++) {
      const offset = i - middleIdxRHS;
      const newPos = {
        x: effectiveWidth,
        y: canvasMiddle + offset * RHSCircleSpacing,
      };
      this.#setCirclePosition('RHS', i + 1, newPos);
    }
  }

  public calculateSRPositions(canvas: HTMLCanvasElement): void {
    const { canvasMiddle, centre } = this.#getCanvasMetrics(canvas);
    const origin = { x: centre.x, y: canvasMiddle };
    const spacingAngle = (Math.PI * 2) / this.algRetriever.numberOfGroup1Agents;

    // reset
    this.#positions = {
      middle: { x: centre.x, y: centre.y },
    };

    for (let i = 0; i < this.algRetriever.numberOfGroup1Agents; i++) {
      const pos = this.utils.polarToCartesian(
        this.#SRRadius,
        spacingAngle * (i + 2),
        origin,
      );
      this.#setCirclePosition('SR', i + 1, pos);
    }
  }
}
