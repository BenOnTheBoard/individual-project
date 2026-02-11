import { ElementRef, inject, Injectable } from '@angular/core';
import { AlgorithmRetrievalService } from '../../../algorithm-retrieval/algorithm-retrieval.service';
import { LayoutService } from './layout/layout.service';
import { TextRendererService } from './text-renderer/text-renderer.service';
import { AgentRendererService } from './agent-renderer/agent-renderer.service';
import { ColourHexService } from '../../../utils/colour-hex.service';
import { LineRendererService } from './line-renderer/line-renderer.service';
import { PreferenceRendererService } from './preference-renderer/preference-renderer.service';
import { Step } from 'src/app/algorithms/interfaces/Step';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  #canvasElement: HTMLCanvasElement;
  public alwaysShowPrefs: boolean = false;
  #ctx: CanvasRenderingContext2D;

  public currentCommand: Step;

  protected algRetriever = inject(AlgorithmRetrievalService);
  protected agentRenderer = inject(AgentRendererService);
  protected layoutService = inject(LayoutService);
  protected lineRenderer = inject(LineRendererService);
  protected prefRenderer = inject(PreferenceRendererService);
  protected textRenderer = inject(TextRendererService);
  protected colourHexService = inject(ColourHexService);

  public setCanvas(canvasRef: ElementRef<HTMLCanvasElement>): void {
    this.#canvasElement = canvasRef.nativeElement;
    const ctx = this.#canvasElement.getContext('2d');
    if (!ctx) {
      throw new Error('CanvasRenderingContext2D not available');
    }
    this.#ctx = ctx;
    this.#updateServiceContexts();
  }

  #updateServiceContexts(): void {
    this.agentRenderer.setContext(this.#ctx);
    this.lineRenderer.setContext(this.#ctx);
    this.prefRenderer.setContext(this.#ctx);
    this.textRenderer.setContext(this.#ctx);
  }

  public setCommand(command: Step): void {
    this.currentCommand = command;
    this.redrawCanvas();
  }

  public initialise(): void {
    this.prefRenderer.resetFirstRun();
  }

  #arrangeSRAgents(): void {
    this.layoutService.calculateSRPositions(this.#canvasElement);
    for (const line of this.currentCommand['currentLines']) {
      this.lineRenderer.drawLine(line, true);
    }
    this.agentRenderer.drawGroupOneAgents();
  }

  #arrangeBipartiteAgents(): void {
    this.layoutService.calculateBipartitePositions(
      this.#canvasElement,
      this.currentCommand,
    );
    for (const line of this.currentCommand['currentLines']) {
      this.lineRenderer.drawLine(line);
    }
    this.agentRenderer.drawGroupOneAgents();
    this.agentRenderer.drawGroupTwoAgents();
  }

  #arrangeAgents(isSR: boolean): void {
    if (isSR) {
      this.#arrangeSRAgents();
    } else {
      this.#arrangeBipartiteAgents();
    }
    this.agentRenderer.selectCircles(this.currentCommand.selectedAgents);
  }

  #arrangePrefs(isSR: boolean): void {
    // ensure that the preference renderer has the correct command
    // /w .setCurrentCommand before calling this function
    const hasRelevantPrefs =
      this.currentCommand.relevantPrefs.length >= 1 && this.alwaysShowPrefs;

    if (hasRelevantPrefs) {
      this.prefRenderer.drawRelevantPrefs();
    } else if (isSR) {
      this.prefRenderer.drawSRPrefs();
    } else {
      this.prefRenderer.drawBipartitePrefs();
    }
  }

  public clearCanvas(): void {
    const elt = this.#canvasElement;
    this.#ctx.clearRect(0, 0, elt.width, elt.height);
  }

  redrawCanvas(command?: Step): void {
    if (command) {
      this.currentCommand = command;
    }

    if (!this.#canvasElement || !this.#ctx || !this.currentCommand) {
      return;
    }

    const parent = document.getElementById('parent');
    if (parent) {
      this.#canvasElement.width = parent.offsetWidth - 20;
      this.#canvasElement.height = parent.offsetHeight - 20;
    }

    this.clearCanvas();

    this.prefRenderer.setCurrentCommand(this.currentCommand);

    const algData = this.currentCommand.algorithmSpecificData;
    const isSR = !!algData['SR'];
    const hasLecturers = !!algData['lecturerCapacity'];
    const hasProjectsOrHospitals = !!algData['hospitalCapacity'];

    this.#arrangeAgents(isSR);
    this.#arrangePrefs(isSR);

    if (hasProjectsOrHospitals) {
      this.prefRenderer.drawCapacities();
    }
    if (hasLecturers) {
      this.prefRenderer.drawLecturers();
    }
  }
}
