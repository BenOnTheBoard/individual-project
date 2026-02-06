import { inject, Injectable } from '@angular/core';
import { AlgorithmRetrievalService } from '../../../../algorithm-retrieval.service';
import { LayoutService } from '../layout/layout.service';
import { TextRendererService } from '../text-renderer/text-renderer.service';
import { Step } from 'src/app/algorithms/interfaces/Step';
import { ColourHexService } from '../../../../utils/colour-hex.service';
import { AgentRendererService } from '../agent-renderer/agent-renderer.service';
import { Position } from 'src/app/utils/position';
import { UtilsService } from 'src/app/utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class PreferenceRendererService {
  #ctx: CanvasRenderingContext2D;
  #cmd: Step;
  #firstRun = true;
  #lineSizes: Map<string, number> = new Map();

  readonly #prefFontSize = 20;
  readonly #lecturerFontSize = 14;
  readonly #lecturerBracketWidth = 1.5;

  readonly #defaultOffsetY = 10;
  readonly #defaultOffsetX = 65; // min dist from centre of circle to prefs

  readonly #hospitalExtraPrefsOffsetX = 20; // to make space for capacity
  readonly #capacityOffsetX = 45;

  readonly #bracketOffsetX = 85;
  readonly #bracketWidth = 15;
  readonly #lecturerOffsetFromBracket = 20;

  protected algRetriever = inject(AlgorithmRetrievalService);
  protected agentRenderer = inject(AgentRendererService);
  protected colourHexService = inject(ColourHexService);
  protected layoutService = inject(LayoutService);
  protected textRenderer = inject(TextRendererService);
  protected utils = inject(UtilsService);

  setContext(ctx: CanvasRenderingContext2D): void {
    this.#ctx = ctx;
  }

  resetFirstRun(): void {
    this.#firstRun = true;
  }

  public setCurrentCommand(command: Step): void {
    this.#cmd = command;
    if (!this.#firstRun) return;

    this.#firstRun = false;
    this.textRenderer.setFontSize(this.#prefFontSize);
    this.#lineSizes = new Map();
    for (let i = 1; i < this.algRetriever.numberOfGroup1Agents + 1; i++) {
      const lineSize = this.#ctx.measureText(
        this.#cmd.group1CurrentPreferences.get(String(i)).join(', '),
      ).width;
      this.#lineSizes.set(String(i), lineSize);
    }
  }

  #getPreferenceText(agent: string): string {
    const prefList = agent.match(/[A-Z]/i)
      ? this.#cmd.group2CurrentPreferences.get(agent)
      : this.#cmd.group1CurrentPreferences.get(agent);
    return prefList.join(', ');
  }

  #getOffsetX(group: 'LHS' | 'RHS', agent?: string): number {
    const isHospital = Boolean(
      this.#cmd.algorithmSpecificData['hospitalCapacity'],
    );

    if (group == 'LHS') {
      return -this.#defaultOffsetX - this.#lineSizes.get(agent);
    } else if (isHospital) {
      return this.#defaultOffsetX + this.#hospitalExtraPrefsOffsetX;
    } else {
      return this.#defaultOffsetX;
    }
  }

  #drawPreferenceList(
    count: number,
    getAgentId: (index: number) => string,
    side: 'LHS' | 'RHS',
  ): void {
    for (let i = 0; i < count; i++) {
      const agent = getAgentId(i);
      const pos = this.layoutService.getPositionOfAgent(`circle${agent}`);
      const offsetX = this.#getOffsetX(side, agent);
      const textPos = { x: pos.x + offsetX, y: pos.y + this.#defaultOffsetY };
      this.textRenderer.drawText(this.#getPreferenceText(agent), textPos);
    }
  }

  public drawBipartitePreferences(): void {
    this.textRenderer.setFontSize(this.#prefFontSize);
    const lhsCount = this.algRetriever.numberOfGroup1Agents;
    const rhsCount = this.algRetriever.numberOfGroup2Agents;

    this.#drawPreferenceList(lhsCount, (i) => String(i + 1), 'LHS');
    this.#drawPreferenceList(
      rhsCount,
      (i) => String.fromCharCode(65 + i),
      'RHS',
    );
  }

  public drawSRPreferences(): void {
    // Given agents arranged clockwise from 6 o'clock
    // the first half should have their preferences on their left
    // and the second should have their preferences on their right
    this.textRenderer.setFontSize(this.#prefFontSize);
    const numAgents = this.algRetriever.numberOfGroup1Agents;
    const lhsCount = Math.ceil(numAgents / 2);
    const rhsCount = numAgents - lhsCount;

    this.#drawPreferenceList(lhsCount, (i) => String(i + 1), 'LHS');
    this.#drawPreferenceList(
      rhsCount,
      (i) => String(lhsCount + (i + 1)),
      'RHS',
    );
  }

  public drawRelevantPreferences(): void {
    this.textRenderer.setFontSize(this.#prefFontSize);
    const relevantPrefs = this.#cmd.relevantPreferences;
    const lhsAgents = relevantPrefs.filter((a) => !/[A-Z]/i.test(a));
    const rhsAgents = relevantPrefs.filter((a) => /[A-Z]/i.test(a));

    this.#drawPreferenceList(lhsAgents.length, (i) => lhsAgents[i], 'LHS');
    this.#drawPreferenceList(rhsAgents.length, (i) => rhsAgents[i], 'RHS');
  }

  public drawCapacities(): void {
    this.textRenderer.setFontSize(this.#prefFontSize);
    const capacityMap = this.#cmd.algorithmSpecificData['hospitalCapacity'];

    for (let i = 0; i < this.algRetriever.numberOfGroup2Agents; i++) {
      const letter = String.fromCharCode(65 + i);
      const capacity = capacityMap[letter];
      const pos = this.layoutService.getPositionOfAgent(`circle${letter}`);
      const textPos = {
        x: pos.x + this.#capacityOffsetX,
        y: pos.y + this.#defaultOffsetY,
      };
      this.textRenderer.drawText(`(${String(capacity)})`, textPos);
    }
  }

  #drawBracket(top: Position, bottom: Position): void {
    // bracket to the right of projects circles
    const bracketRightOffsetX = this.#bracketOffsetX + this.#bracketWidth;
    const radiusOfCircles = this.agentRenderer.getRadiusOfCircles();
    this.#ctx.beginPath();
    this.#ctx.moveTo(top.x + this.#bracketOffsetX, top.y - radiusOfCircles);
    this.#ctx.lineTo(top.x + bracketRightOffsetX, top.y - radiusOfCircles);
    this.#ctx.lineTo(
      bottom.x + bracketRightOffsetX,
      bottom.y + radiusOfCircles,
    );
    this.#ctx.lineTo(
      bottom.x + this.#bracketOffsetX,
      bottom.y + radiusOfCircles,
    );
    this.#ctx.stroke();
  }

  #drawLecturerText(lecturerNum: number, location: Position): void {
    const lecturerCapacity =
      this.#cmd.algorithmSpecificData['lecturerCapacity'];
    const lecturerRanking = this.#cmd.algorithmSpecificData['lecturerRanking'];
    const lecturerText = `Lecturer ${String(lecturerNum)} (${
      lecturerCapacity[lecturerNum]
    })\n${String(lecturerRanking[lecturerNum - 1])}`;
    this.textRenderer.drawText(lecturerText, location);
  }

  #getProjectPositions(projectList: Array<string>): [Position, Position] {
    const first = projectList[0];
    const last = projectList[projectList.length - 1];
    const firstProject = this.utils.getLastChar(first);
    const lastProject = this.utils.getLastChar(last);
    const posFirst = this.layoutService.getPositionOfAgent(
      `circle${firstProject}`,
    );
    const posLast = this.layoutService.getPositionOfAgent(
      `circle${lastProject}`,
    );
    return [posFirst, posLast];
  }

  public drawLecturers(): void {
    this.#ctx.strokeStyle = this.colourHexService.getHex('black');
    this.#ctx.lineWidth = this.#lecturerBracketWidth;
    this.textRenderer.setFontSize(this.#lecturerFontSize);

    const lecturerProjects =
      this.#cmd.algorithmSpecificData['lecturerProjects'];

    lecturerProjects.forEach((projectList: Array<string>, idx: number) => {
      const lecturerNum = idx + 1;
      const [posFirst, posLast] = this.#getProjectPositions(projectList);
      const centralY = (posLast.y + posFirst.y) / 2;
      const lecturerOffsetX =
        this.#bracketOffsetX +
        this.#bracketWidth +
        this.#lecturerOffsetFromBracket;
      const lecturerTextPos = {
        x: posFirst.x + lecturerOffsetX,
        y: centralY - this.#lecturerFontSize / 2,
      };

      this.#drawBracket(posFirst, posLast);
      this.#drawLecturerText(lecturerNum, lecturerTextPos);
    });
  }
}
