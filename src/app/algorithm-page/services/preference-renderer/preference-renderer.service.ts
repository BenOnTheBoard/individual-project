import { Injectable } from '@angular/core';
import { AlgorithmRetrievalService } from '../../../algorithm-retrieval.service';
import { LayoutService } from '../layout/layout.service';
import { TextRendererService } from '../text-renderer/text-renderer.service';
import { Step } from '../../algorithms/interfaces/Step';
import { ColourHexService } from '../colour-hex.service';
import { AgentRendererService } from '../agent-renderer/agent-renderer.service';

@Injectable({
  providedIn: 'root',
})
export class PreferenceRendererService {
  private ctx: CanvasRenderingContext2D;
  private cmd: Step;
  private firstRun = true;
  private lineSizes: Map<string, number> = new Map();

  private readonly prefFontSize = 20;
  private readonly defaultOffsetY = 10;
  private readonly defaultOffsetX = 65; // min dist from prefs to centre of circle
  private readonly hospitalExtraPrefsOffsetX = 20; // to make space for capacity
  private readonly capacityOffsetX = 45;

  constructor(
    public algService: AlgorithmRetrievalService,
    public agentRenderer: AgentRendererService,
    public layoutService: LayoutService,
    public textRenderer: TextRendererService,
    public colourHexService: ColourHexService
  ) {}

  setContext(ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx;
  }

  resetFirstRun(): void {
    this.firstRun = true;
  }

  setCurrentCommand(command: Step) {
    this.cmd = command;
    if (this.firstRun) {
      this.firstRun = false;
      this.textRenderer.setFontSize(this.prefFontSize);
      this.lineSizes = new Map();
      for (let i = 1; i < this.algService.numberOfGroup1Agents + 1; i++) {
        let lineSize = this.ctx.measureText(
          this.cmd.group1CurrentPreferences.get(String(i)).join(', ')
        ).width;
        this.lineSizes.set(String(i), lineSize);
      }
    }
  }

  getPreferenceText(agent: string): string {
    let prefList: String[];
    if (agent.match(/[A-Z]/i)) {
      prefList = this.cmd.group2CurrentPreferences.get(agent);
    } else {
      prefList = this.cmd.group1CurrentPreferences.get(agent);
    }
    return prefList.join(', ');
  }

  getOffsetX(group: 'LHS' | 'RHS', idx?: number): number {
    const isHospital = Boolean(
      this.cmd.algorithmSpecificData['hospitalCapacity']
    );

    if (group == 'LHS') {
      return -this.defaultOffsetX - this.lineSizes.get(String(idx));
    } else if (isHospital) {
      return this.defaultOffsetX + this.hospitalExtraPrefsOffsetX;
    } else {
      return this.defaultOffsetX;
    }
  }

  drawAllPreferences(): void {
    this.textRenderer.setFontSize(this.prefFontSize);

    for (let i = 1; i < this.algService.numberOfGroup1Agents + 1; i++) {
      const agent = String(i);
      const [posX, posY] = this.layoutService.getPositionOfAgent(
        'circle' + agent
      );
      this.textRenderer.drawText(
        this.getPreferenceText(agent),
        posX + this.getOffsetX('LHS', i),
        posY + this.defaultOffsetY
      );
    }

    for (let i = 0; i < this.algService.numberOfGroup2Agents; i++) {
      const agent = String.fromCharCode(65 + i);
      const [posX, posY] = this.layoutService.getPositionOfAgent(
        'circle' + agent
      );
      this.textRenderer.drawText(
        this.getPreferenceText(agent),
        posX + this.getOffsetX('RHS'),
        posY + this.defaultOffsetY
      );
    }
  }

  drawAllPreferences1Group() {
    this.textRenderer.setFontSize(this.prefFontSize);

    const num = this.algService.numberOfGroup1Agents;

    for (let i = 1; i < num / 2 + 1; i++) {
      const agent = String(i);
      const [posX, posY] = this.layoutService.getPositionOfAgent('circle' + i);
      this.textRenderer.drawText(
        this.getPreferenceText(agent),
        posX + this.getOffsetX('LHS', i),
        posY + this.defaultOffsetY
      );
    }

    for (let i = num / 2 + 1; i < num + 1; i++) {
      const agent = String(i);
      const [posX, posY] = this.layoutService.getPositionOfAgent('circle' + i);
      this.textRenderer.drawText(
        this.getPreferenceText(agent),
        posX + this.getOffsetX('RHS'),
        posY + this.defaultOffsetY
      );
    }
  }

  drawRelevantPreferences() {
    for (let agent of this.cmd.relevantPreferences) {
      const [posX, posY] = this.layoutService.getPositionOfAgent(
        'circle' + agent
      );
      if (agent.match(/[A-Z]/i)) {
        this.textRenderer.drawText(
          this.getPreferenceText(agent),
          posX + this.getOffsetX('RHS'),
          posY + this.defaultOffsetY
        );
      } else {
        this.textRenderer.drawText(
          this.getPreferenceText(agent),
          posX + this.getOffsetX('LHS', Number(agent)),
          posY + this.defaultOffsetY
        );
      }
    }
  }

  drawHospitalCapacity() {
    this.textRenderer.setFontSize(this.prefFontSize);
    const hospitalCapacityMap =
      this.cmd.algorithmSpecificData['hospitalCapacity'];
    let currentLetter: string;
    let currentCapacity: number;

    for (let i = 0; i < this.algService.numberOfGroup2Agents; i++) {
      currentLetter = String.fromCharCode(65 + i);
      currentCapacity = hospitalCapacityMap[currentLetter];
      const [posX, posY] = this.layoutService.getPositionOfAgent(
        'circle' + currentLetter
      );

      this.textRenderer.drawText(
        '(' + String(currentCapacity) + ')',
        posX + this.capacityOffsetX,
        posY + this.defaultOffsetY
      );
    }
  }

  drawSPAlecturers(command: Step) {
    this.ctx.strokeStyle = this.colourHexService.getHex('black');
    this.ctx.lineWidth = 1.5;
    this.textRenderer.setFontSize(14);
    const radiusOfCircles = this.agentRenderer.getRadiusOfCircles();

    this.ctx.beginPath();

    let lecturerNum = 1;
    let text = '';
    for (let projectList of command.algorithmSpecificData['lecturerProjects']) {
      // get coords
      const first = projectList[0];
      const last = projectList[projectList.length - 1];
      const firstProjectLetter = first.slice(-1)[0];
      const lastProjectLetter = last.slice(-1)[0];

      const [posFirstX, posFirstY] = this.layoutService.getPositionOfAgent(
        'circle' + String(firstProjectLetter)
      );
      const [posLastX, posLastY] = this.layoutService.getPositionOfAgent(
        'circle' + String(lastProjectLetter)
      );

      const centerPos = {
        posX: posFirstX,
        posY: (posLastY + posFirstY) / 2 + 10,
      };

      // bracket lines, around project circles
      this.ctx.moveTo(posFirstX + 85, posFirstY - radiusOfCircles);
      this.ctx.lineTo(posFirstX + 100, posFirstY - radiusOfCircles);

      this.ctx.lineTo(posLastX + 100, posLastY + radiusOfCircles);

      this.ctx.moveTo(posLastX + 85, posLastY + radiusOfCircles);
      this.ctx.lineTo(posLastX + 100, posLastY + radiusOfCircles);

      // lecturer text
      text =
        'Lecturer' +
        String(lecturerNum) +
        ' (' +
        command.algorithmSpecificData['lecturerCapacity'][lecturerNum] +
        ')';
      this.textRenderer.drawText(
        text,
        centerPos.posX + 120,
        centerPos.posY - 20
      );

      text = String(
        command.algorithmSpecificData['lecturerRanking'][lecturerNum - 1]
      );
      this.textRenderer.drawText(text, centerPos.posX + 120, centerPos.posY);
      lecturerNum++;
    }

    this.ctx.stroke();
  }
}
