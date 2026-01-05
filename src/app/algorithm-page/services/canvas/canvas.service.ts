import { ElementRef, Injectable } from '@angular/core';
import { AlgorithmRetrievalService } from '../../../algorithm-retrieval.service';
import { LayoutService } from '../layout/layout.service';
import { TextRendererService } from '../text-renderer/text-renderer.service';
import { AgentRendererService } from '../agent-renderer/agent-renderer.service';
import { ColourHexService } from '../colour-hex.service';
import { LineRendererService } from '../line-renderer/line-renderer.service';
import { PreferenceRendererService } from '../preference-renderer/preference-renderer.service';
import { Step } from '../../algorithms/interfaces/Step';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  private canvasElement!: HTMLCanvasElement;
  public alwaysShowPreferences: boolean = false;
  private ctx: CanvasRenderingContext2D;

  public currentCommand: Step;

  constructor(
    public algService: AlgorithmRetrievalService,
    public agentRenderer: AgentRendererService,
    public layoutService: LayoutService,
    public lineRenderer: LineRendererService,
    public prefRenderer: PreferenceRendererService,
    public textRenderer: TextRendererService,
    public colourHexService: ColourHexService
  ) {}

  setCanvas(canvasRef: ElementRef<HTMLCanvasElement>): void {
    this.canvasElement = canvasRef.nativeElement;
    const ctx = this.canvasElement.getContext('2d');
    if (!ctx) {
      throw new Error('CanvasRenderingContext2D not available');
    }
    this.ctx = ctx;
    this.updateServiceContexts();
  }

  private updateServiceContexts(): void {
    this.agentRenderer.setContext(this.ctx);
    this.lineRenderer.setContext(this.ctx);
    this.prefRenderer.setContext(this.ctx);
    this.textRenderer.setContext(this.ctx);
  }

  setCommand(command: Step) {
    this.currentCommand = command;
    this.redrawCanvas();
  }

  initialise() {
    this.prefRenderer.resetFirstRun();
  }

  private arrangeSRAgents(): void {
    this.layoutService.calculateRoommatePositions(this.canvasElement);
    for (let line of this.currentCommand['currentLines']) {
      this.lineRenderer.drawLine(line, true);
    }
    this.agentRenderer.drawGroupOneAgents();
  }

  private arrangeBipartiteAgents(): void {
    this.layoutService.calculateBipartitePositions(
      this.canvasElement,
      this.currentCommand
    );
    for (let line of this.currentCommand['currentLines']) {
      this.lineRenderer.drawLine(line);
    }
    this.agentRenderer.drawGroupOneAgents();
    this.agentRenderer.drawGroupTwoAgents();
  }

  private arrangeAgents(isSR: boolean): void {
    if (isSR) {
      this.arrangeSRAgents();
    } else {
      this.arrangeBipartiteAgents();
    }
    this.agentRenderer.selectCircles(
      this.currentCommand.currentlySelectedAgents
    );
  }

  private arrangePreferences(isSR: boolean): void {
    // ensure that the preference renderer has the correct command
    // /w .setCurrentCommand before calling this function
    const hasRelevantPrefs =
      this.currentCommand.relevantPreferences.length >= 1 &&
      this.alwaysShowPreferences;

    if (hasRelevantPrefs) {
      this.prefRenderer.drawRelevantPreferences();
    } else {
      if (isSR) {
        this.prefRenderer.drawAllPreferences1Group();
      } else {
        this.prefRenderer.drawAllPreferences();
      }
    }
  }

  private clearCanvas(): void {
    const elt = this.canvasElement;
    this.ctx.clearRect(0, 0, elt.width, elt.height);
  }

  redrawCanvas(command?: Step): void {
    if (command) {
      this.currentCommand = command;
    }

    if (!this.canvasElement || !this.ctx || !this.currentCommand) {
      return;
    }

    const parent = document.getElementById('parent');
    if (parent) {
      this.canvasElement.width = parent.offsetWidth - 20;
      this.canvasElement.height = parent.offsetHeight - 20;
    }

    this.clearCanvas();

    this.prefRenderer.setCurrentCommand(this.currentCommand);

    const algData = this.currentCommand.algorithmSpecificData;
    const isSR = !!algData['SR'];
    const hasLecturers = !!algData['lecturerCapacity'];
    const hasProjectsOrHospitals = !!algData['hospitalCapacity'];

    this.arrangeAgents(isSR);
    this.arrangePreferences(isSR);

    if (hasProjectsOrHospitals) {
      this.prefRenderer.drawHospitalCapacity();
    }

    if (hasLecturers) {
      this.prefRenderer.drawSPAlecturers();
    }
  }
}
