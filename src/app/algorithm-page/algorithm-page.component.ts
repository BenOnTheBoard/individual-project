import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule, NgClass } from '@angular/common';
import { AgentTitlesComponent } from './agent-titles/agent-titles.component';
import { PlaybackControlsComponent } from './playback-controls/playback-controls.component';
import { Router } from '@angular/router';
import { AlgorithmRetrievalService } from '../algorithm-retrieval/algorithm-retrieval.service';
import { UtilsService } from '../utils/utils.service';
import { CanvasService } from './services/canvas/canvas.service';
import { PlaybackService } from './services/playback/playback.service';
import { InfoSidebarComponent } from './info-sidebar/info-sidebar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlgPageNavbarComponent } from './navbar/alg-page-navbar.component';
declare var $: any; // declaring jquery for use in this file
import anime from 'animejs/lib/anime.es.js';

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
  private canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private leftSidebar = viewChild<SidebarComponent>('leftSidebar');
  private rightSidebar = viewChild<InfoSidebarComponent>('rightSidebar');
  private navbar = viewChild<AlgPageNavbarComponent>('topNavbar');

  readonly #barsFadeDuration = 600; // side and navbar fade in and out duration
  readonly #sidebarSlideDuration = 700;
  readonly #canvasFadeDuration = 300;
  readonly #mainContentFadeDuration = 500;
  readonly #mainContentInitFadeDuration = 1200;

  protected dialogOpen: boolean = false;
  protected duringAnimation: boolean = false;
  protected isCodeShowing: boolean = true;
  protected isInfoShowing: boolean = true;
  protected SRstable: boolean = true;
  protected tutorialStep: number;

  protected playback = inject(PlaybackService);
  protected algRetriever = inject(AlgorithmRetrievalService);
  protected drawService = inject(CanvasService);
  protected utils = inject(UtilsService);
  protected router = inject(Router);

  // --------------------------------------------------------------------------------- | INIT FUNCTIONS
  ngOnInit(): void {
    this.drawService.setCanvas(this.canvas());
    this.drawService.initialise();
    this.#setupPlaybackService();

    // initialise all of the popovers for the tutorial
    this.tutorialStep = 0;
    $(() => {
      $('[data-toggle="popover"]').popover();
    });
  }

  ngAfterViewInit(): void {
    this.#initShowPage();
    this.drawService.redrawCanvas();
  }

  #setupPlaybackService(): void {
    const { currentAlgorithm, numberOfGroup1Agents, numberOfGroup2Agents } =
      this.algRetriever;
    if (currentAlgorithm.name == 'Stable Roommates Problem') {
      this.playback.setAlgorithm(
        currentAlgorithm.id,
        numberOfGroup1Agents,
        numberOfGroup2Agents,
        this.SRstable,
      );
    } else {
      this.playback.setAlgorithm(
        currentAlgorithm.id,
        numberOfGroup1Agents,
        numberOfGroup2Agents,
      );
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.dialogOpen || this.tutorialStep != 0) return;

    switch (event.key) {
      case 'ArrowRight':
      case 'd':
        if (
          this.playback.pause &&
          this.playback.stepCounter < this.playback.numCommands
        ) {
          this.playback.forwardStep();
        }
        return;
      case 'ArrowLeft':
      case 'a':
        if (this.playback.pause && this.playback.stepCounter != 0) {
          this.playback.backStep();
        }
        return;
      case ' ':
        if (this.playback.stepCounter < this.playback.numCommands) {
          this.playback.toggle();
        }
        return;
      case 'r':
      case '#':
        this.generateNewPreferences();
        return;
    }
  }

  // --------------------------------------------------------------------------------- | ON CLICK FUNCTIONS

  protected handleNavbarCommand(command: string): void {
    switch (command) {
      case 'generatePreferences':
        this.generateNewPreferences();
        return;
      case 'goHome':
        this.goHome();
        return;
      case 'toggleLeftSidebar':
        this.toggleSidebar('left');
        return;
      case 'toggleRightSidebar':
        this.toggleSidebar('right');
        return;
      case 'toggleSRStable':
        this.SRstable = !this.SRstable;
        return;
    }
  }

  protected async goHome(): Promise<void> {
    this.#fadeToHome();
    await this.utils.delay(1000);
    this.router.navigateByUrl('/');
  }

  protected async generateNewPreferences(): Promise<void> {
    this.#fadeCanvas(true);
    await this.utils.delay(300);
    this.#setupPlaybackService();
    this.#fadeCanvas(false);
    this.drawService.redrawCanvas();
  }

  protected async toggleSidebar(side: 'left' | 'right'): Promise<void> {
    if (this.duringAnimation) return;
    this.duringAnimation = true;

    this.#fadeMainContent(true);

    if (side == 'left') {
      this.leftSidebar().toggleSidebar(this.#sidebarSlideDuration);
      this.isCodeShowing = !this.isCodeShowing;
    } else {
      this.rightSidebar().toggleSidebar(this.#sidebarSlideDuration);
      this.isInfoShowing = !this.isInfoShowing;
    }

    this.drawService.clearCanvas();
    this.#fadeMainContent(false);
    await this.utils.delay(this.#canvasFadeDuration);
    this.drawService.redrawCanvas();
    await this.utils.delay(
      this.#sidebarSlideDuration - this.#canvasFadeDuration,
    );
    this.duringAnimation = false;
  }

  // --------------------------------------------------------------------------------- | TUTORIAL FUNCTIONS

  protected tutorialUpdate(newStep: number): void {
    switch (newStep) {
      case 0:
        this.stopTutorial();
        return;
      case 1:
        if (!this.isCodeShowing) {
          this.toggleSidebar('left');
        }
        this.startTutorial();
        return;
      case 2:
        this.sidebarTutorial();
        return;
      case 3:
        this.mainContentTutorial();
        return;
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
  #fadeAnimation(target: string, fadeOut: boolean, duration: number): void {
    const direction = fadeOut ? 'reverse' : 'normal';
    anime({
      targets: target,
      easing: 'easeInOutQuint',
      opacity: [0, 1],
      direction,
      duration,
    });
  }

  #fadeCanvas(fadeOut: boolean, setDuration?: number): void {
    const duration = setDuration ?? this.#canvasFadeDuration;
    this.#fadeAnimation('#myCanvas', fadeOut, duration);
  }

  #fadeMainContent(fadeOut: boolean, setDuration?: number): void {
    const duration = setDuration ?? this.#mainContentFadeDuration;
    this.#fadeAnimation('#mainContent', fadeOut, duration);
  }

  #fadeAllBars(fadeOut: boolean): void {
    this.navbar().toggleNavbar(fadeOut, this.#barsFadeDuration);
    this.leftSidebar().fadeSidebar(fadeOut, this.#barsFadeDuration);
    this.rightSidebar().fadeSidebar(fadeOut, this.#barsFadeDuration);
  }

  #initShowPage(): void {
    this.#fadeAllBars(false);
    this.#fadeMainContent(false, this.#mainContentInitFadeDuration);
  }

  #fadeToHome(): void {
    this.#fadeAllBars(true);
    this.#fadeMainContent(true, this.#barsFadeDuration);
  }
}
