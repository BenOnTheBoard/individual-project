import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AlgDescriptionComponent } from './alg-description/alg-description.component';
import { PseudocodeComponent } from './pseudocode/pseudocode.component';
import { FreeAgentsComponent } from './free-agents/free-agents.component';
import { ExecutionLogComponent } from './execution-log/execution-log.component';
import { NgClass } from '@angular/common';
declare var anime: any; // declaring the animejs animation library for use in this file

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [
    ExecutionLogComponent,
    FreeAgentsComponent,
    PseudocodeComponent,
    AlgDescriptionComponent,
    NgClass,
  ],
})
export class SidebarComponent implements OnInit {
  @Input() showCode: boolean;
  @Input() tutorialStep: number;

  @ViewChild('sidebarContainer')
  private sidebar: ElementRef;
  private sidebarWidth: number;

  private isInAnimation: boolean;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.updateSidebarWidth();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateSidebarWidth();
    this.setCurrentPosition();
  }

  private updateSidebarWidth(): void {
    this.sidebarWidth = this.sidebar.nativeElement.offsetWidth;
  }

  private setCurrentPosition(): void {
    const targetX = !this.showCode ? '0px' : `-${this.sidebarWidth}px`;
    this.sidebar.nativeElement.style.transform = `translateX(${targetX})`;
  }

  private async hideSidebar(): Promise<void> {
    anime({
      targets: this.sidebar.nativeElement,
      easing: 'easeInOutQuint',
      translateX: [0, `-${this.sidebarWidth}px`],
      delay: 200,
      duration: 700,
      complete: () => {
        this.isInAnimation = false;
      },
    });
  }

  private async showSidebar(): Promise<void> {
    anime({
      targets: this.sidebar.nativeElement,
      easing: 'easeInOutQuint',
      translateX: [`-${this.sidebarWidth}px`, 0],
      duration: 600,
      complete: () => {
        this.isInAnimation = false;
      },
    });
  }

  async fadeSidebar(fadeOut: boolean, duration: number): Promise<void> {
    const direction = fadeOut ? 'reverse' : 'normal';
    anime({
      targets: this.sidebar.nativeElement,
      easing: 'easeInOutQuint',
      opacity: [0, 1],
      direction: direction,
      duration: duration,
    });
  }

  async toggleSidebar(): Promise<void> {
    if (this.isInAnimation) return;
    this.isInAnimation = true;

    if (!this.showCode) {
      this.hideSidebar();
    } else {
      this.showSidebar();
    }
  }
}
