import { Injectable } from '@angular/core';
import { AlgorithmRetrievalService } from '../../../algorithm-retrieval.service';
import { LayoutService } from '../layout/layout.service';
import { TextRendererService } from '../text-renderer/text-renderer.service';
import { Step } from '../../algorithms/interfaces/Step';
import { ColourHexService } from '../colour-hex.service';
import { AgentRendererService } from '../agent-renderer/agent-renderer.service';
import { Position } from 'src/app/utils/position';
import { UtilsService } from 'src/app/utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class PreferenceRendererService {
  private ctx: CanvasRenderingContext2D;
  private cmd: Step;
  private firstRun = true;
  private lineSizes: Map<string, number> = new Map();

  private readonly prefFontSize = 20;
  private readonly lecturerFontSize = 14;
  private readonly lecturerBracketWidth = 1.5;

  private readonly defaultOffsetY = 10;
  private readonly defaultOffsetX = 65; // min dist from prefs to centre of circle

  private readonly hospitalExtraPrefsOffsetX = 20; // to make space for capacity
  private readonly capacityOffsetX = 45;

  private readonly bracketOffsetX = 85;
  private readonly bracketWidth = 15;
  private readonly lecturerOffsetFromBracket = 20;

  constructor(
    public algService: AlgorithmRetrievalService,
    public agentRenderer: AgentRendererService,
    public layoutService: LayoutService,
    public textRenderer: TextRendererService,
    public colourHexService: ColourHexService,
    public utils: UtilsService
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

  getOffsetX(group: 'LHS' | 'RHS', agent?: string): number {
    const isHospital = Boolean(
      this.cmd.algorithmSpecificData['hospitalCapacity']
    );

    if (group == 'LHS') {
      return -this.defaultOffsetX - this.lineSizes.get(agent);
    } else if (isHospital) {
      return this.defaultOffsetX + this.hospitalExtraPrefsOffsetX;
    } else {
      return this.defaultOffsetX;
    }
  }

  private drawPreferences(
    count: number,
    getAgentId: (index: number) => string,
    side: 'LHS' | 'RHS'
  ): void {
    for (let i = 0; i < count; i++) {
      const agent = getAgentId(i);
      const pos = this.layoutService.getPositionOfAgent('circle' + agent);
      const offsetX = this.getOffsetX(side, agent);
      this.textRenderer.drawText(
        this.getPreferenceText(agent),
        pos.x + offsetX,
        pos.y + this.defaultOffsetY
      );
    }
  }

  drawAllPreferences(): void {
    this.textRenderer.setFontSize(this.prefFontSize);
    const lhsCount = this.algService.numberOfGroup1Agents;
    const rhsCount = this.algService.numberOfGroup2Agents;

    this.drawPreferences(lhsCount, (i) => String(i + 1), 'LHS');
    this.drawPreferences(rhsCount, (i) => String.fromCharCode(65 + i), 'RHS');
  }

  drawAllPreferences1Group() {
    // Given agents arranged clockwise from 6 o'clock
    // the first half should have their preferences on their left
    // and the second should have their preferences on their right
    this.textRenderer.setFontSize(this.prefFontSize);
    const numAgents = this.algService.numberOfGroup1Agents;
    const lhsCount = Math.ceil(numAgents / 2);
    const rhsCount = numAgents - lhsCount;

    this.drawPreferences(lhsCount, (i) => String(i + 1), 'LHS');
    this.drawPreferences(rhsCount, (i) => String(lhsCount + (i + 1)), 'RHS');
  }

  drawRelevantPreferences() {
    this.textRenderer.setFontSize(this.prefFontSize);
    const relevantPrefs = this.cmd.relevantPreferences;
    const lhsAgents = relevantPrefs.filter((a) => !/[A-Z]/i.test(a));
    const rhsAgents = relevantPrefs.filter((a) => /[A-Z]/i.test(a));

    this.drawPreferences(lhsAgents.length, (i) => lhsAgents[i], 'LHS');
    this.drawPreferences(rhsAgents.length, (i) => rhsAgents[i], 'RHS');
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
      const pos = this.layoutService.getPositionOfAgent(
        'circle' + currentLetter
      );

      this.textRenderer.drawText(
        '(' + String(currentCapacity) + ')',
        pos.x + this.capacityOffsetX,
        pos.y + this.defaultOffsetY
      );
    }
  }

  private drawBracket(top: Position, bottom: Position): void {
    // bracket to the right of projects circles
    const bracketRightOffsetX = this.bracketOffsetX + this.bracketWidth;
    const radiusOfCircles = this.agentRenderer.getRadiusOfCircles();
    this.ctx.moveTo(top.x + this.bracketOffsetX, top.y - radiusOfCircles);
    this.ctx.lineTo(top.x + bracketRightOffsetX, top.y - radiusOfCircles);
    this.ctx.lineTo(bottom.x + bracketRightOffsetX, bottom.y + radiusOfCircles);
    this.ctx.lineTo(bottom.x + this.bracketOffsetX, bottom.y + radiusOfCircles);
    this.ctx.stroke();
  }

  private drawLecturerText(lecturerNum: number, location: Position): void {
    const lecturerCapacity = this.cmd.algorithmSpecificData['lecturerCapacity'];
    const lecturerRanking = this.cmd.algorithmSpecificData['lecturerRanking'];
    const lecturerText = `Lecturer ${String(lecturerNum)} (${
      lecturerCapacity[lecturerNum]
    })\n${String(lecturerRanking[lecturerNum - 1])}`;
    this.textRenderer.drawText(lecturerText, location.x, location.y);
  }

  private getProjectPositions(projectList: string[]): [Position, Position] {
    const first = projectList[0];
    const last = projectList[projectList.length - 1];
    const firstProject = this.utils.getLastChar(first);
    const lastProject = this.utils.getLastChar(last);
    const posFirst = this.layoutService.getPositionOfAgent(
      'circle' + firstProject
    );
    const posLast = this.layoutService.getPositionOfAgent(
      'circle' + lastProject
    );
    return [posFirst, posLast];
  }

  drawSPAlecturers(): void {
    this.ctx.strokeStyle = this.colourHexService.getHex('black');
    this.ctx.lineWidth = this.lecturerBracketWidth;
    this.ctx.beginPath();
    this.textRenderer.setFontSize(this.lecturerFontSize);

    const lecturerProjects = this.cmd.algorithmSpecificData['lecturerProjects'];

    lecturerProjects.forEach((projectList: string[], idx: number) => {
      const lecturerNum = idx + 1;
      const [posFirst, posLast] = this.getProjectPositions(projectList);
      const centralY = (posLast.y + posFirst.y) / 2;
      const lecturerOffsetX =
        this.bracketOffsetX +
        this.bracketWidth +
        this.lecturerOffsetFromBracket;
      const lecturerTextPos = {
        x: posFirst.x + lecturerOffsetX,
        y: centralY - this.lecturerFontSize / 2,
      };

      this.drawBracket(posFirst, posLast);
      this.drawLecturerText(lecturerNum, lecturerTextPos);
    });
  }
}
