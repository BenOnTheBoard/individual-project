import { ElementRef, Injectable } from '@angular/core';
import { AlgorithmRetrievalService } from '../../../algorithm-retrieval.service';
import { LayoutService } from '../layout/layout.service';
import { TextRendererService } from '../text-renderer/text-renderer.service';

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
    public layoutService: LayoutService,
    public textRendererService: TextRendererService
  ) {}

  setCanvas(canvasRef: ElementRef<HTMLCanvasElement>): void {
    this.canvasElement = canvasRef.nativeElement;
    const ctx = this.canvasElement.getContext('2d');
    if (!ctx) {
      throw new Error('CanvasRenderingContext2D not available');
    }
    this.ctx = ctx;
    this.textRendererService.setContext(this.ctx);
  }

  setCommand(command) {
    this.currentCommand = command;
    this.redrawCanvas();
  }

  initialise() {
    this.firstRun = true;
  }

  drawLHSCircles() {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#FF6332';

    // Draw LHS circles in orange
    for (let i = 1; i < this.algService.numberOfGroup1Agents + 1; i++) {
      const [posX, posY] = this.layoutService.getPositionOfAgent('circle' + i);
      this.ctx.moveTo(posX + this.radiusOfCircles, posY);
      this.ctx.arc(posX, posY, this.radiusOfCircles, 0, Math.PI * 2, true);
    }

    this.ctx.fill();
    this.ctx.stroke();

    // Draw text (numbers)
    this.textRendererService.setFontSize(this.radiusOfCircles);
    for (let i = 1; i < this.algService.numberOfGroup1Agents + 1; i++) {
      const [posX, posY] = this.layoutService.getPositionOfAgent('circle' + i);
      this.textRendererService.drawText(String(i), posX - 8, posY + 10);
    }
  }

  drawRHSCircles() {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#CA32FF';
    let currentLetter = 'A';

    // Draw RHS circles in orange
    for (let i = 0; i < this.algService.numberOfGroup2Agents; i++) {
      const [posX, posY] = this.layoutService.getPositionOfAgent(
        'circle' + currentLetter
      );
      this.ctx.moveTo(posX + this.radiusOfCircles, posY);
      this.ctx.arc(posX, posY, this.radiusOfCircles, 0, Math.PI * 2, true);
      currentLetter = String.fromCharCode(
        ((currentLetter.charCodeAt(0) + 1 - 65) % 26) + 65
      );
    }

    this.ctx.fill();
    this.ctx.stroke();

    currentLetter = 'A';

    this.textRendererService.setFontSize(this.radiusOfCircles);
    // Draw text (numbers)
    for (let i = 1; i < this.algService.numberOfGroup2Agents + 1; i++) {
      const [posX, posY] = this.layoutService.getPositionOfAgent(
        'circle' + currentLetter
      );
      this.textRendererService.drawText(currentLetter, posX - 9, posY + 11);
      currentLetter = String.fromCharCode(
        ((currentLetter.charCodeAt(0) + 1 - 65) % 26) + 65
      );
    }
  }

  drawCircles1Group() {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#FF6332';

    // number to rotated the circle, so that numbering looks more natural
    let offset = 1;
    // Draw LHS circles in orange
    for (let i = 1; i < this.algService.numberOfGroup1Agents + 1; i++) {
      const [posX, posY] = this.layoutService.getPositionOfAgent('circle' + i);
      this.ctx.moveTo(posX + this.radiusOfCircles, posY);
      this.ctx.arc(posX, posY, this.radiusOfCircles, 0, Math.PI * 2, true);
    }

    // colours circles
    this.ctx.fill();
    this.ctx.stroke();

    this.textRendererService.setFontSize(this.radiusOfCircles);
    for (
      let i = offset;
      i < this.algService.numberOfGroup1Agents + offset;
      i++
    ) {
      const [posX, posY] = this.layoutService.getPositionOfAgent('circle' + i);
      this.textRendererService.drawText(
        String(i - offset + 1),
        posX - 8,
        posY + 10
      );
    }
  }

  drawLine1Group(line: Array<string>): void {
    let color: string = line[2];

    if (color == 'red') {
      this.ctx.strokeStyle = '#EB2A2A';
    } else if (color == 'green') {
      this.ctx.strokeStyle = '#53D26F';
    }

    this.ctx.lineWidth = 3;

    const [posFromX, posFromY] = this.layoutService.getPositionOfAgent(
      'circle' + line[0]
    );
    const [posToX, posToY] = this.layoutService.getPositionOfAgent(
      'circle' + line[1]
    );

    const xLen = posToX - posFromX;
    const yLen = posToY - posFromY;

    let halfX = posFromX + xLen * 0.8;
    let halfY = posFromY + yLen * 0.8;

    let angle = Math.atan(yLen / xLen);

    let newX = 0;
    let newY = 0;

    let right: boolean;
    if (posFromX < posToX) {
      right = true;
    } else {
      right = false;
    }

    // draw arrow
    this.ctx.beginPath();
    this.ctx.moveTo(posFromX, posFromY);

    if (color != 'green') {
      this.ctx.lineTo(halfX, halfY);

      if (right) {
        newX = halfX + 20 * Math.cos(angle + (3 * Math.PI) / 4);
        newY = halfY + 20 * Math.sin(angle + (3 * Math.PI) / 4);
      } else {
        newX = halfX + 20 * Math.cos(angle + Math.PI / 4);
        newY = halfY + 20 * Math.sin(angle + Math.PI / 4);
      }

      this.ctx.lineTo(newX, newY);
      this.ctx.lineTo(halfX, halfY);

      if (right) {
        newX = halfX + 20 * Math.cos(angle - (3 * Math.PI) / 4);
        newY = halfY + 20 * Math.sin(angle - (3 * Math.PI) / 4);
      } else {
        newX = halfX + 20 * Math.cos(angle - Math.PI / 4);
        newY = halfY + 20 * Math.sin(angle - Math.PI / 4);
      }

      this.ctx.lineTo(newX, newY);
    } else {
      this.ctx.lineTo(posToX, posToY);
    }

    this.ctx.stroke();

    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1;
  }

  drawLine(line: Array<string>): void {
    const [posFromX, posFromY] = this.layoutService.getPositionOfAgent(
      'circle' + line[0]
    );
    const [posToX, posToY] = this.layoutService.getPositionOfAgent(
      'circle' + line[1]
    );
    let color: string = line[2];

    if (color == 'red') {
      this.ctx.strokeStyle = '#EB2A2A';
    } else if (color == 'green') {
      this.ctx.strokeStyle = '#53D26F';
    }

    this.ctx.lineWidth = 3;

    this.ctx.beginPath();
    this.ctx.moveTo(posFromX, posFromY);
    this.ctx.lineTo(posToX, posToY);
    this.ctx.stroke();

    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1;
  }

  drawAllPreferences() {
    this.textRendererService.setFontSize(20);

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
      this.textRendererService.drawText(
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
      this.textRendererService.drawText(
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
    this.textRendererService.setFontSize(20);

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
      this.textRendererService.drawText(
        group1PreferenceList[i - 1].join(', '),
        posX - this.lineSizes.get(String(i)) * 2 - 65,
        posY + 7
      );
    }

    for (let i = num / 2 + 1; i < num + 1; i++) {
      const [posX, posY] = this.layoutService.getPositionOfAgent('circle' + i);
      this.textRendererService.drawText(
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
        this.textRendererService.drawText(
          group2PreferenceList[agent.charCodeAt(0) - 65].join(', '),
          posX +
            (this.currentCommand['algorithmSpecificData']['hospitalCapacity']
              ? 115
              : 65),
          posY + 7
        );
      } else {
        this.textRendererService.drawText(
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

    this.textRendererService.setFontSize(20);

    let currentLetter = 'A';

    for (let i = 1; i < this.algService.numberOfGroup2Agents + 1; i++) {
      let currentCapacity: number = hospitalCapacityMap[currentLetter];
      const [posX, posY] = this.layoutService.getPositionOfAgent(
        'circle' + currentLetter
      );

      this.textRendererService.drawText(
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
    this.ctx.strokeStyle = '#000000';
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

      this.textRendererService.setFontSize(14);

      // lecturer text
      text =
        'Lecturer' +
        String(count + 1) +
        ' (' +
        this.currentCommand['algorithmSpecificData']['lecturerCapacity'][
          count + 1
        ] +
        ')';
      this.textRendererService.drawText(
        text,
        centerPos.positionX + 120,
        centerPos.positionY - 20
      );

      text = String(
        this.currentCommand['algorithmSpecificData']['lecturerRanking'][count]
      );
      this.textRendererService.drawText(
        text,
        centerPos.positionX + 120,
        centerPos.positionY
      );
      count++;
    }

    this.ctx.stroke();

    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1;
  }

  selectCircles(circles: Array<string>) {
    let originalLineWidth: number = this.ctx.lineWidth;
    let originalStrokeStyle: string | CanvasGradient | CanvasPattern =
      this.ctx.strokeStyle;

    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = '#53D26F';

    for (let agent of circles) {
      const [posX, posY] = this.layoutService.getPositionOfAgent(
        'circle' + agent
      );
      this.ctx.beginPath();
      this.ctx.moveTo(posX + this.radiusOfCircles, posY);
      this.ctx.arc(posX, posY, this.radiusOfCircles, 0, Math.PI * 2, true);
      this.ctx.stroke();
    }

    this.ctx.lineWidth = originalLineWidth;
    this.ctx.strokeStyle = originalStrokeStyle;
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
        this.drawLine1Group(line);
      }
      this.drawCircles1Group();
    } else {
      // draw lines between circles (matches and relations)
      this.layoutService.calculateBipartitePositions(
        this.canvasElement,
        this.currentCommand
      );
      for (let line of this.currentCommand['currentLines']) {
        this.drawLine(line);
      }
      this.drawLHSCircles();
      this.drawRHSCircles();
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

    this.selectCircles(this.currentCommand['currentlySelectedAgents']);
  }
}
