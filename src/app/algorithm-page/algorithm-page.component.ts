import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule, NgClass } from '@angular/common';
import { AgentTitlesComponent } from './agent-titles/agent-titles.component';
import { PlaybackControlsComponent } from './playback-controls/playback-controls.component';
import { Router } from '@angular/router';
import { AlgorithmRetrievalService } from '../algorithm-retrieval.service';
import { UtilsService } from '../utils/utils.service';
import { CanvasService } from './services/canvas/canvas.service';
import { PlaybackService } from './services/playback/playback.service';
import { InfoSidebarComponent } from './info-sidebar/info-sidebar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlgPageNavbarComponent } from './navbar/alg-page-navbar.component';
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
    AlgPageNavbarComponent,
  ],
})
export class AlgorithmPageComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  private canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('leftSidebar', { static: true })
  private leftSidebar: SidebarComponent;

  @ViewChild('rightSidebar', { static: true })
  private rightSidebar: InfoSidebarComponent;

  @ViewChild('topNavbar', { static: true })
  private navbar: AlgPageNavbarComponent;

  private readonly barsFadeDuration = 600; // side and navbar fade in and out duration
  private readonly sidebarSlideDuration = 700;
  private readonly canvasFadeDuration = 300;
  private readonly mainContentFadeDuration = 500;
  private readonly mainContentInitFadeDuration = 1200;

  protected dialogOpen: boolean = false;
  protected duringAnimation: boolean = false;
  protected isCodeShowing: boolean = true;
  protected isInfoShowing: boolean = true;
  protected SRstable: boolean = true;
  protected tutorialStep: number;

  // --------------------------------------------------------------------------------- | INIT FUNCTIONS

  constructor(
    public playback: PlaybackService,
    public algorithmService: AlgorithmRetrievalService,
    public drawService: CanvasService,
    public utils: UtilsService,
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

  // --------------------------------------------------------------------------------- | ON CLICK FUNCTIONS

  protected handleNavbarCommand(command: string): void {
    switch (command) {
      case 'toggleLeftSidebar':
        this.toggleSidebar('left');
        break;
      case 'toggleRightSidebar':
        this.toggleSidebar('right');
        break;
      case 'goHome':
        this.goHome();
        break;
      case 'generatePreferences':
        this.generateNewPreferences();
        break;
    }
  }

  protected async goHome(): Promise<void> {
    this.fadeToHome();
    await this.utils.delay(1000);
    this.router.navigateByUrl('/');
  }

  protected async generateNewPreferences(): Promise<void> {
    this.fadeCanvas(true);
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
    this.fadeCanvas(false);
    this.drawService.redrawCanvas();
  }

  protected async toggleSidebar(side: 'left' | 'right'): Promise<void> {
    if (this.duringAnimation) return;
    this.duringAnimation = true;

    this.fadeMainContent(true);

    if (side == 'left') {
      this.toggleLeftSidebar();
    } else {
      this.toggleRightSidebar();
    }

    this.drawService.clearCanvas();
    this.fadeMainContent(false);
    await this.utils.delay(200);

    this.drawService.redrawCanvas();
    this.duringAnimation = false;
  }

  private toggleLeftSidebar(): void {
    this.leftSidebar.toggleSidebar(this.sidebarSlideDuration);
    this.isCodeShowing = !this.isCodeShowing;
  }

  private toggleRightSidebar(): void {
    this.rightSidebar.toggleSidebar(this.sidebarSlideDuration);
    this.isInfoShowing = !this.isInfoShowing;
  }

  // --------------------------------------------------------------------------------- | TUTORIAL FUNCTIONS

  protected tutorialUpdate(newStep: number): void {
    switch (newStep) {
      case 0:
        this.stopTutorial();
        break;
      case 1:
        if (!this.isCodeShowing) {
          this.toggleSidebar('left');
        }
        this.startTutorial();
        break;
      case 2:
        this.sidebarTutorial();
        break;
      case 3:
        this.mainContentTutorial();
        break;
    }
  }

  startTutorial(): void {
    $('.navbarPopover').popover('show');
  }

  sidebarTutorial(): void {
    $('.navbarPopover').popover('hide');
    $('.sidebarPopover').popover('show');
  }

  mainContentTutorial(): void {
    $('.sidebarPopover').popover('hide');
    $('.mainContentPopover').popover('show');
  }

  stopTutorial(): void {
    $('.navbarPopover').popover('hide');
    $('.sidebarPopover').popover('hide');
    $('.mainContentPopover').popover('hide');
  }

  // --------------------------------------------------------------------------------- | ANIMATIONS
  private fadeAnimation(
    target: string,
    fadeOut: boolean,
    duration: number,
  ): void {
    const direction = fadeOut ? 'reverse' : 'normal';
    anime({
      targets: target,
      easing: 'easeInOutQuint',
      opacity: [0, 1],
      direction: direction,
      duration: duration,
    });
  }

  private fadeCanvas(fadeOut: boolean, setDuration?: number): void {
    const duration = setDuration ?? this.canvasFadeDuration;
    this.fadeAnimation('#myCanvas', fadeOut, duration);
  }

  private fadeMainContent(fadeOut: boolean, setDuration?: number): void {
    const duration = setDuration ?? this.mainContentFadeDuration;
    this.fadeAnimation('#mainContent', fadeOut, duration);
  }

  private fadeAllBars(fadeOut: boolean): void {
    this.navbar.toggleNavbar(fadeOut, this.barsFadeDuration);
    this.leftSidebar.fadeSidebar(fadeOut, this.barsFadeDuration);
    this.rightSidebar.fadeSidebar(fadeOut, this.barsFadeDuration);
  }

  private initShowPage(): void {
    this.fadeAllBars(false);
    this.fadeMainContent(false, this.mainContentInitFadeDuration);
  }

  private fadeToHome(): void {
    this.fadeAllBars(true);
    this.fadeMainContent(true, this.barsFadeDuration);
  }
}
