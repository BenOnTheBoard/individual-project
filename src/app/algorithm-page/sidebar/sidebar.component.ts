import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  viewChild,
  input,
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
  readonly isCodeShowing = input<boolean>(undefined);
  readonly tutorialStep = input<number>(undefined);

  private sidebar = viewChild<ElementRef>('sidebarContainer');
  #sidebarWidth: number;
  #isInAnimation: boolean;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.#updateSidebarWidth();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.#updateSidebarWidth();
    this.#setCurrentPosition();
  }

  #updateSidebarWidth(): void {
    this.#sidebarWidth = this.sidebar().nativeElement.offsetWidth;
  }

  #setCurrentPosition(): void {
    const targetX = this.isCodeShowing() ? '0px' : `-${this.#sidebarWidth}px`;
    this.sidebar().nativeElement.style.transform = `translateX(${targetX})`;
  }

  async fadeSidebar(fadeOut: boolean, duration: number): Promise<void> {
    const direction = fadeOut ? 'reverse' : 'normal';
    anime({
      targets: this.sidebar().nativeElement,
      easing: 'easeInOutQuint',
      opacity: [0, 1],
      direction,
      duration,
    });
  }

  public async toggleSidebar(duration: number): Promise<void> {
    if (this.#isInAnimation) return;
    this.#isInAnimation = true;

    const direction = this.isCodeShowing() ? 'reverse' : 'normal';
    anime({
      targets: this.sidebar().nativeElement,
      easing: 'easeInOutQuint',
      translateX: [`-${this.#sidebarWidth}px`, 0],
      direction,
      duration,
      complete: () => {
        this.#isInAnimation = false;
      },
    });
  }
}
