import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule, NgClass } from '@angular/common';
import { AgentTitlesComponent } from './agent-titles/agent-titles.component';
import { PlaybackControlsComponent } from './playback-controls/playback-controls.component';
import { Router } from '@angular/router';
import { AlgorithmRetrievalService } from '../algorithm-retrieval.service';
import { UtilsService } from '../utils/utils.service';
import { AnimationGuideDialogComponent } from './animation-guide-dialog/animation-guide-dialog.component';
import { CanvasService } from './services/canvas/canvas.service';
import { PlaybackService } from './services/playback/playback.service';
import { InfoSidebarComponent } from './info-sidebar/info-sidebar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
declare var $: any; // declaring jquery for use in this file
declare var anime: any; // declaring the animejs animation library for use in this file

@Component({
  selector: 'algorithm-page',
  templateUrl: './algorithm-page.component.html',
  styleUrls: ['./algorithm-page.component.scss'],
  imports: [
    MatIconModule,
    MatTooltipModule,
    CommonModule,
    NgClass,
    SidebarComponent,
    InfoSidebarComponent,
    AgentTitlesComponent,
    PlaybackControlsComponent,
  ],
})
export class AlgorithmPageComponent implements OnInit {
  // --------------------------------------------------------------------------------- | INSTANCE VARIABLES

  // looks for the canvas element on the algorithm page and assigns it to the canvas variable
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('leftSidebar')
  leftSidebar: SidebarComponent;

  @ViewChild('rightSidebar')
  rightSidebar: SidebarComponent;

  showCode: boolean = false;
  dialogOpen: boolean = false;

  showInfo: boolean = false;

  tutorialStep: number;

  duringAnimation: boolean = false;

  firstSelection: boolean = true;
  algorithm = new FormControl<string | null>('');
  numPeople: number;

  // where SR is going to generate a stable matching or a unstable matching
  SRstable: boolean = true;
  SRstableText: string = 'Generating Stable Matchings';

  // --------------------------------------------------------------------------------- | INIT FUNCTIONS

  constructor(
    public playback: PlaybackService,
    public algorithmService: AlgorithmRetrievalService,
    public drawService: CanvasService,
    public utils: UtilsService,
    public dialog: MatDialog,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.drawService.setCanvas(this.canvas);
    this.drawService.initialise();
    this.playback.setAlgorithm(
      this.algorithmService.currentAlgorithm.id,
      this.algorithmService.numberOfGroup1Agents,
      this.algorithmService.numberOfGroup2Agents,
    );

    // initialise all of the popovers for the tutorial
    $(function () {
      $('[data-toggle="popover"]').popover();
    });

    this.tutorialStep = 0;
  }

  ngAfterViewInit(): void {
    this.initShowPage();
    this.drawService.redrawCanvas();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.dialogOpen && this.tutorialStep == 0) {
      if (event.key == 'ArrowRight' || event.key == 'd') {
        if (
          !(
            !this.playback.pause ||
            this.playback.stepCounter >= this.playback.numCommands
          )
        ) {
          this.playback.forwardStep();
        }
      } else if (event.key == 'ArrowLeft' || event.key == 'a') {
        if (!(!this.playback.pause || this.playback.stepCounter == 0)) {
          this.playback.backStep();
        }
      } else if (event.key == ' ') {
        if (!(this.playback.stepCounter >= this.playback.numCommands)) {
          this.playback.toggle();
        }
      } else if (event.key == 'r' || event.key == '#') {
        this.generateNewPreferences();
      }
    }
  }

  // --------------------------------------------------------------------------------- | GENERAL FUNCTIONS

  // open the animation guide dialog with a callback function
  openAnimationGuideDialog(): void {
    const dialogRef = this.dialog.open(AnimationGuideDialogComponent);

    this.dialogOpen = true;

    dialogRef.afterClosed().subscribe(() => {
      this.dialogOpen = false;
    });
  }

  // --------------------------------------------------------------------------------- | ON CLICK FUNCTIONS

  async goHome(): Promise<void> {
    this.fadeToHome();
    await this.utils.delay(1000);
    this.router.navigateByUrl('/');
  }

  async generateNewPreferences(): Promise<void> {
    // clears any code highlighting
    var command = this.playback.commandList[this.playback.previousStepCounter];
    let a = document.getElementById('line' + command['lineNumber']);
    a.style.backgroundColor = '';
    a.style.color = '';

    // animates changing of preferences (fade in/out)
    this.fadeCanvasOut();
    await this.utils.delay(300);

    if (
      this.algorithmService.currentAlgorithm.name == 'Stable Roommates Problem'
    ) {
      this.playback.setAlgorithm(
        this.algorithmService.currentAlgorithm.id,
        this.algorithmService.numberOfGroup1Agents,
        this.algorithmService.numberOfGroup2Agents,
        null,
        this.SRstable,
      );
    } else {
      this.playback.setAlgorithm(
        this.algorithmService.currentAlgorithm.id,
        this.algorithmService.numberOfGroup1Agents,
        this.algorithmService.numberOfGroup2Agents,
      );
    }
    this.fadeCanvasIn();
    this.drawService.redrawCanvas();
  }

  // function run when toggle sidebar button clicked (top left)
  async toggleSidebar(): Promise<void> {
    if (this.duringAnimation) return;
    this.duringAnimation = true;
    this.hideMainContent();

    this.leftSidebar.toggleSidebar();

    this.showCode = !this.showCode;
    this.drawService.clearCanvas();
    this.showMainContent();
    await this.utils.delay(200);
    this.drawService.redrawCanvas();

    this.duringAnimation = false;
  }

  // function run when toggle sidebar button clicked (top left)
  async toggleInfoSidebar(): Promise<void> {
    if (this.duringAnimation) return;
    this.duringAnimation = true;
    this.hideMainContent();

    this.rightSidebar.toggleSidebar();

    this.showInfo = !this.showInfo;
    this.drawService.clearCanvas();
    this.showMainContent();
    await this.utils.delay(200);
    this.drawService.redrawCanvas();

    this.duringAnimation = false;
  }

  ChangeStableSR(): void {
    if (this.SRstable == true) {
      this.SRstable = false;
      this.SRstableText = 'Generating Unstable Matchings';
    } else {
      this.SRstable = true;
      this.SRstableText = 'Generating Stable Matchings';
    }
  }

  // --------------------------------------------------------------------------------- | TUTORIAL FUNCTIONS

  nextTutorialStep(): void {
    if (this.tutorialStep == 0) {
      if (this.showCode) {
        this.toggleSidebar();
      }
      this.startTutorial();
      // step 2
    } else if (this.tutorialStep == 1) {
      this.sidebarTutorial();
      // step 3
    } else if (this.tutorialStep == 2) {
      this.mainContentTutorial();
      // step 4
    } else if (this.tutorialStep == 3) {
      this.stopTutorial();
    }
  }

  startTutorial(): void {
    this.tutorialStep += 1;
    $('.navbarPopover').popover('show');
  }

  sidebarTutorial(): void {
    this.tutorialStep += 1;
    $('.navbarPopover').popover('hide');
    $('.sidebarPopover').popover('show');
  }

  mainContentTutorial(): void {
    this.tutorialStep += 1;
    $('.sidebarPopover').popover('hide');
    $('.mainContentPopover').popover('show');
  }

  stopTutorial(): void {
    this.tutorialStep = 0;
    $('.navbarPopover').popover('hide');
    $('.sidebarPopover').popover('hide');
    $('.mainContentPopover').popover('hide');
  }

  // --------------------------------------------------------------------------------- | ANIMATIONS

  initShowPage(): void {
    anime({
      targets: '.navbar',
      easing: 'easeOutQuint',
      translateY: [-150, 0],
      delay: 200,
      duration: 900,
    });

    anime({
      targets: '#mainContent',
      easing: 'easeInOutQuint',
      opacity: [0, 1],
      delay: 670,
      duration: 900,
    });
  }

  fadeToHome(): void {
    anime({
      targets: '.navbar',
      easing: 'easeOutQuint',
      translateY: [0, -150],
      delay: 400,
      duration: 900,
    });

    anime({
      targets: '#mainContent',
      easing: 'easeInOutQuint',
      opacity: [1, 0],
      duration: 600,
    });
  }

  fadeCanvasOut(): void {
    anime({
      targets: '#myCanvas',
      easing: 'easeInOutQuint',
      opacity: [1, 0],
      duration: 300,
    });
  }

  fadeCanvasIn(): void {
    anime({
      targets: '#myCanvas',
      easing: 'easeInOutQuint',
      opacity: [0, 1],
      duration: 300,
    });
  }

  hideMainContent(): void {
    anime({
      targets: '#mainContent',
      easing: 'easeInOutQuint',
      opacity: [1, 0],
      duration: 500,
    });
  }

  showMainContent(): void {
    anime({
      targets: '#mainContent',
      easing: 'easeInOutQuint',
      opacity: [0, 1],
      duration: 500,
    });
  }
}
