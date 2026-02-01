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

  protected async toggleSidebar(side: 'left' | 'right'): Promise<void> {
    if (this.duringAnimation) return;
    this.duringAnimation = true;
    this.hideMainContent();

    if (side == 'left') {
      this.toggleLeftSidebar();
    } else {
      this.toggleRightSidebar();
    }

    this.drawService.clearCanvas();
    this.showMainContent();
    await this.utils.delay(200);

    this.drawService.redrawCanvas();
    this.duringAnimation = false;
  }

  private toggleLeftSidebar(): void {
    this.leftSidebar.toggleSidebar();
    this.isCodeShowing = !this.isCodeShowing;
  }

  private toggleRightSidebar(): void {
    this.rightSidebar.toggleSidebar();
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

  protected initShowPage(): void {
    this.navbar.toggleNavbar(false, this.barsFadeDuration);
    this.leftSidebar.fadeSidebar(false, this.barsFadeDuration);
    this.rightSidebar.fadeSidebar(false, this.barsFadeDuration);

    anime({
      targets: '#mainContent',
      easing: 'easeInOutQuint',
      opacity: [0, 1],
      delay: 670,
      duration: 900,
    });
  }

  protected fadeToHome(): void {
    this.navbar.toggleNavbar(true, this.barsFadeDuration);
    this.leftSidebar.fadeSidebar(true, this.barsFadeDuration);
    this.rightSidebar.fadeSidebar(true, this.barsFadeDuration);
    anime({
      targets: '#mainContent',
      easing: 'easeInOutQuint',
      opacity: [1, 0],
      duration: 600,
    });
  }

  protected fadeCanvasOut(): void {
    anime({
      targets: '#myCanvas',
      easing: 'easeInOutQuint',
      opacity: [1, 0],
      duration: 300,
    });
  }

  protected fadeCanvasIn(): void {
    anime({
      targets: '#myCanvas',
      easing: 'easeInOutQuint',
      opacity: [0, 1],
      duration: 300,
    });
  }

  protected hideMainContent(): void {
    anime({
      targets: '#mainContent',
      easing: 'easeInOutQuint',
      opacity: [1, 0],
      duration: 500,
    });
  }

  protected showMainContent(): void {
    anime({
      targets: '#mainContent',
      easing: 'easeInOutQuint',
      opacity: [0, 1],
      duration: 500,
    });
  }
}
