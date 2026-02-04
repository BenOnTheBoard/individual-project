import { Injectable } from '@angular/core';
import { ExecutionService } from '../execution/execution.service';
import { CanvasService } from '../canvas/canvas.service';
import { Step } from 'src/app/algorithms/interfaces/Step';

@Injectable({
  providedIn: 'root',
})
export class PlaybackService {
  // algorithm data variables
  public algorithmData: Object;
  commandList: Array<Object>;
  currentCommand: Step;

  // playback variables
  firstRun: boolean = true;
  stepCounter: number;
  previousStepCounter: number;
  currentLine: number;
  numCommands: number;
  pause: boolean = true;
  speed: number = 500;

  description: string = 'Click play to run the program below!';

  constructor(
    public exeService: ExecutionService,
    public drawService: CanvasService,
  ) {}

  initialise(): void {
    this.algorithmData = {};
    this.commandList = [];
    this.currentCommand = {
      lineNumber: 0,
      freeAgents: [],
      matches: new Map<string, string>(),
      stepVariables: {},
      group1CurrentPreferences: new Map<string, Array<string>>(),
      group2CurrentPreferences: new Map<string, Array<string>>(),
      currentlySelectedAgents: [],
      currentLines: [],
      algorithmSpecificData: new Map<string, Object>(),
      relevantPreferences: [],
    };
  }

  resetPlaybackData(): void {
    this.firstRun = true;
    this.stepCounter = 0;
    this.previousStepCounter = 0;
    this.currentLine = 0;
    this.pause = true;

    this.description = 'Click play to run the program below!';
  }

  setAlgorithm(
    algorithm: string,
    numberOfAgents: number,
    numberOfGroup2Agents: number = numberOfAgents,
    preferences: Map<String, Array<String>> = null,
    SRstable: boolean = true,
  ): void {
    this.initialise();
    this.algorithmData = this.exeService.getExecutionFlow(
      algorithm,
      numberOfAgents,
      numberOfGroup2Agents,
      preferences,
      SRstable,
    );
    this.commandList = this.algorithmData['commands'];
    this.resetPlaybackData();
    this.numCommands = this.commandList.length - 1;

    this.updateCurrentCommand();
  }

  setSpeed(milliseconds: number) {
    this.speed = milliseconds;
  }

  updateCurrentCommand(): void {
    if (this.previousStepCounter != this.stepCounter) {
      this.previousStepCounter = this.stepCounter;
    }

    this.currentCommand = this.algorithmData['commands'][this.stepCounter];
    this.description = this.algorithmData['descriptions'][this.stepCounter];
    this.currentLine = this.currentCommand['lineNumber'];
    this.drawService.redrawCanvas(this.currentCommand);
  }

  restart(): void {
    this.jumpToStep(0);
  }

  goToEnd(): void {
    this.jumpToStep(this.numCommands);
  }

  jumpToStep(step: number): void {
    this.pause = true;
    this.stepCounter = step;
    this.updateCurrentCommand();
  }

  backStep(): void {
    if (this.stepCounter > 0) {
      this.stepCounter--;
    }
    this.updateCurrentCommand();
  }

  forwardStep(): void {
    if (this.stepCounter < this.numCommands) {
      this.stepCounter++;
    }
    this.updateCurrentCommand();
  }

  async toggle() {
    if (this.firstRun || this.pause) {
      this.firstRun = false;
      this.pause = false;
      this.play();
      return;
    }
    this.pause = true;
  }

  async play(): Promise<void> {
    while (this.stepCounter < this.numCommands) {
      if (this.pause) {
        break;
      }

      await this.sleep(this.speed);

      if (!this.pause) {
        this.stepCounter++;
        this.updateCurrentCommand();
        if (this.stepCounter >= this.numCommands) {
          this.pause = true;
        }
      }
    }
  }

  async sleep(msec: number) {
    return new Promise((resolve) => setTimeout(resolve, msec));
  }

  onSliderChange(val: number) {
    if (this.firstRun) {
      this.firstRun = false;
    }

    if (this.previousStepCounter != this.stepCounter) {
      this.previousStepCounter = this.stepCounter;
    }

    this.pause = true;
    this.stepCounter = val;
    this.updateCurrentCommand();
  }
}
