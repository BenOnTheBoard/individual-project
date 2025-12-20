import { ElementRef, Injectable } from '@angular/core';
import { AlgorithmRetrievalService } from '../../../algorithm-retrieval.service';
import { LayoutService } from '../layout/layout.service';
import { TextRendererService } from '../text-renderer/text-renderer.service';
import { AgentRendererService } from '../agent-renderer/agent-renderer.service';
import { ColourHexService } from '../colour-hex.service';
import { LineRendererService } from '../line-renderer/line-renderer.service';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  originalGroup1Preferences: Array<Array<string>>;
  originalGroup2Preferences: Array<Array<string>>;

  // circle properties
  radiusOfCircles: number = 30;

  alwaysShowPreferences: boolean = false;

  private canvasElement!: HTMLCanvasElement;
  public currentCommand: Object;
  public ctx: CanvasRenderingContext2D;
  lineSizes: Map<string, number> = new Map();
  firstRun = true;

  constructor(
    public algService: AlgorithmRetrievalService,
    public agentRenderer: AgentRendererService,
    public layoutService: LayoutService,
    public lineRenderer: LineRendererService,
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
    this.textRenderer.setContext(this.ctx);
  }

  setCommand(command) {
    this.currentCommand = command;
    this.redrawCanvas();
  }

  initialise() {
    this.firstRun = true;
  }

  drawAllPreferences() {
    this.textRenderer.setFontSize(20);

    let group1PreferenceList: Array<Array<string>> = Object.values(
      this.currentCommand['group1CurrentPreferences']
    );

    if (group1PreferenceList.length <= 0) {
      group1PreferenceList = Array.from(
        this.currentCommand['group1CurrentPreferences'].values()
      );
    }

    for (let i = 1; i < this.algService.numberOfGroup1Agents + 1; i++) {
      const [posX, posY] = this.layoutService.getPositionOfAgent('circle' + i);
      this.textRenderer.drawText(
        group1PreferenceList[i - 1].join(', '),
        posX - this.lineSizes.get(String(i)) * 2 - 65,
        posY + 7
      );
    }

    // only draw group2 if it is not SR

    let group2PreferenceList: Array<Array<string>> = Object.values(
      this.currentCommand['group2CurrentPreferences']
    );
    let currentLetter = 'A';

    if (group2PreferenceList.length <= 0) {
      group2PreferenceList = Array.from(
        this.currentCommand['group2CurrentPreferences'].values()
      );
    }

    for (let i = 1; i < this.algService.numberOfGroup2Agents + 1; i++) {
      const [posX, posY] = this.layoutService.getPositionOfAgent(
        'circle' + currentLetter
      );
      this.textRenderer.drawText(
        group2PreferenceList[i - 1].join(', '),
        posX +
          (this.currentCommand['algorithmSpecificData']['hospitalCapacity']
            ? 115
            : 65),
        posY + 7
      );
      currentLetter = String.fromCharCode(
        ((currentLetter.charCodeAt(0) + 1 - 65) % 26) + 65
      );
    }
  }

  drawAllPreferences1Group() {
    this.textRenderer.setFontSize(20);

    let group1PreferenceList: Array<Array<string>> = Object.values(
      this.currentCommand['group1CurrentPreferences']
    );

    if (group1PreferenceList.length <= 0) {
      group1PreferenceList = Array.from(
        this.currentCommand['group1CurrentPreferences'].values()
      );
    }

    let num = this.algService.numberOfGroup1Agents;

    for (let i = 1; i < num / 2 + 1; i++) {
      const [posX, posY] = this.layoutService.getPositionOfAgent('circle' + i);
      this.textRenderer.drawText(
        group1PreferenceList[i - 1].join(', '),
        posX - this.lineSizes.get(String(i)) * 2 - 65,
        posY + 7
      );
    }

    for (let i = num / 2 + 1; i < num + 1; i++) {
      const [posX, posY] = this.layoutService.getPositionOfAgent('circle' + i);
      this.textRenderer.drawText(
        group1PreferenceList[i - 1].join(', '),
        posX + 65,
        posY + 7
      );
    }
  }

  drawRelevantPreferences() {
    let group1PreferenceList: Array<Array<string>> = Object.values(
      this.currentCommand['group1CurrentPreferences']
    );

    if (group1PreferenceList.length <= 0) {
      group1PreferenceList = Array.from(
        this.currentCommand['group1CurrentPreferences'].values()
      );
    }

    let group2PreferenceList: Array<Array<string>> = Object.values(
      this.currentCommand['group2CurrentPreferences']
    );

    if (group2PreferenceList.length <= 0) {
      group2PreferenceList = Array.from(
        this.currentCommand['group2CurrentPreferences'].values()
      );
    }

    for (let agent of this.currentCommand['relevantPreferences']) {
      const [posX, posY] = this.layoutService.getPositionOfAgent(
        'circle' + agent
      );
      if (agent.match(/[A-Z]/i)) {
        this.textRenderer.drawText(
          group2PreferenceList[agent.charCodeAt(0) - 65].join(', '),
          posX +
            (this.currentCommand['algorithmSpecificData']['hospitalCapacity']
              ? 115
              : 65),
          posY + 7
        );
      } else {
        this.textRenderer.drawText(
          group1PreferenceList[agent - 1].join(', '),
          posX - this.lineSizes.get(agent) * 2 - 65,
          posY + 7
        );
      }
    }
  }

  drawHospitalCapacity() {
    let hospitalCapacityMap =
      this.currentCommand['algorithmSpecificData']['hospitalCapacity'];

    this.textRenderer.setFontSize(20);

    let currentLetter = 'A';

    for (let i = 1; i < this.algService.numberOfGroup2Agents + 1; i++) {
      let currentCapacity: number = hospitalCapacityMap[currentLetter];
      const [posX, posY] = this.layoutService.getPositionOfAgent(
        'circle' + currentLetter
      );

      this.textRenderer.drawText(
        '(' + String(currentCapacity) + ')',
        posX + 45,
        posY + 7
      );

      currentLetter = String.fromCharCode(
        ((currentLetter.charCodeAt(0) + 1 - 65) % 26) + 65
      );
    }
  }

  drawSPAlecturers() {
    this.ctx.strokeStyle = this.colourHexService.getHex('black');
    this.ctx.lineWidth = 1.5;

    this.ctx.beginPath();

    let count = 0;
    let text = '';
    for (let projectList of this.currentCommand['algorithmSpecificData'][
      'lecturerProjects'
    ]) {
      // get coords
      let first = projectList[0];
      let last = projectList.slice(-1)[0];

      let firstLetter = first.slice(-1)[0];
      let lastLetter = last.slice(-1)[0];

      const [posFirstX, posFirstY] = this.layoutService.getPositionOfAgent(
        'circle' + String(firstLetter)
      );
      const [posLastX, posLastY] = this.layoutService.getPositionOfAgent(
        'circle' + String(lastLetter)
      );

      let centerPos = { positionX: 0, positionY: 0 };

      // location on where to draw lecturer name and cap
      if (firstLetter == lastLetter) {
        centerPos = {
          positionX: posFirstX,
          positionY: posFirstY + 10,
        };
      } else {
        centerPos = {
          positionX: posFirstX,
          positionY: (posLastY - posFirstY) / 2 + posFirstY + 10,
        };
      }

      // bracket lines
      this.ctx.moveTo(posFirstX + 85, posFirstY - this.radiusOfCircles);
      this.ctx.lineTo(posFirstX + 100, posFirstY - this.radiusOfCircles);

      this.ctx.lineTo(posLastX + 100, posLastY + this.radiusOfCircles);

      this.ctx.moveTo(posLastX + 85, posLastY + this.radiusOfCircles);
      this.ctx.lineTo(posLastX + 100, posLastY + this.radiusOfCircles);

      this.textRenderer.setFontSize(14);

      // lecturer text
      text =
        'Lecturer' +
        String(count + 1) +
        ' (' +
        this.currentCommand['algorithmSpecificData']['lecturerCapacity'][
          count + 1
        ] +
        ')';
      this.textRenderer.drawText(
        text,
        centerPos.positionX + 120,
        centerPos.positionY - 20
      );

      text = String(
        this.currentCommand['algorithmSpecificData']['lecturerRanking'][count]
      );
      this.textRenderer.drawText(
        text,
        centerPos.positionX + 120,
        centerPos.positionY
      );
      count++;
    }

    this.ctx.stroke();

    this.ctx.strokeStyle = this.colourHexService.getHex('black');
    this.ctx.lineWidth = 1;
  }

  redrawCanvas(command?: Object): void {
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

    if (this.firstRun) {
      this.originalGroup1Preferences = Array.from(
        this.currentCommand['group1CurrentPreferences'].values()
      );
      this.originalGroup2Preferences = Array.from(
        this.currentCommand['group2CurrentPreferences'].values()
      );
      this.firstRun = false;
    }

    this.lineSizes = new Map();
    for (let i = 1; i < this.algService.numberOfGroup1Agents + 1; i++) {
      let lineSize = this.ctx.measureText(
        this.originalGroup1Preferences[i - 1].join(', ')
      ).width;
      this.lineSizes.set(String(i), lineSize);
    }

    this.ctx.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );

    // draw circles

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
      this.drawSPAlecturers();
    }

    if (this.currentCommand['algorithmSpecificData']['hospitalCapacity']) {
      this.drawHospitalCapacity();
    }

    if (
      this.currentCommand['relevantPreferences'].length >= 1 &&
      this.alwaysShowPreferences
    ) {
      this.drawRelevantPreferences();
    } else {
      // preferences drawn differently for SR
      if (this.currentCommand['algorithmSpecificData']['SR']) {
        this.drawAllPreferences1Group();
      } else {
        this.drawAllPreferences();
      }
    }

    this.agentRenderer.selectCircles(
      this.currentCommand['currentlySelectedAgents']
    );
  }
}
