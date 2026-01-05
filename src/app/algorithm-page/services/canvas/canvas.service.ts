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

    this.ctx.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
    this.prefRenderer.setCurrentCommand(this.currentCommand);

    // if SR Algorithm
    if (this.currentCommand['algorithmSpecificData']['SR']) {
      // draw lines between circles (matches and relations)
      this.layoutService.calculateRoommatePositions(this.canvasElement);
      for (let line of this.currentCommand['currentLines']) {
        this.lineRenderer.drawLine(line, true);
      }
      this.agentRenderer.drawGroupOneAgents();
    } else {
      // draw lines between circles (matches and relations)
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

    // draw project lecturer Viz
    if (this.currentCommand['algorithmSpecificData']['lecturerCapacity']) {
      this.prefRenderer.drawSPAlecturers();
    }

    if (this.currentCommand['algorithmSpecificData']['hospitalCapacity']) {
      this.prefRenderer.drawHospitalCapacity();
    }

    if (
      this.currentCommand['relevantPreferences'].length >= 1 &&
      this.alwaysShowPreferences
    ) {
      this.prefRenderer.drawRelevantPreferences();
    } else {
      // preferences drawn differently for SR
      if (this.currentCommand['algorithmSpecificData']['SR']) {
        this.prefRenderer.drawAllPreferences1Group();
      } else {
        this.prefRenderer.drawAllPreferences();
      }
    }

    this.agentRenderer.selectCircles(
      this.currentCommand['currentlySelectedAgents']
    );
  }
}
