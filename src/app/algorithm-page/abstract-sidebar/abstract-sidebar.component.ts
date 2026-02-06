import {
  Component,
  ElementRef,
  HostListener,
  input,
  Signal,
} from '@angular/core';
import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-abstract-sidebar',
  templateUrl: './abstract-sidebar.component.html',
})
export abstract class AbstractSidebarComponent {
  protected tutorialStep = input<number>(undefined);
  protected abstract sidebar: Signal<ElementRef<any>>;

  protected direction: number;
  protected sidebarWidth: number;
  protected isInAnimation: boolean;

  ngAfterViewInit(): void {
    this.updateSidebarWidth();
  }

  abstract getIsShowing(): boolean;

  protected setSide(side: 'left' | 'right'): void {
    this.direction = side == 'left' ? -1 : 1;
  }

  protected getOffScreenX(): number {
    return this.direction * this.sidebarWidth;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateSidebarWidth();
    this.fixCurrentPosition();
  }

  protected updateSidebarWidth(): void {
    this.sidebarWidth = this.sidebar().nativeElement.offsetWidth;
  }

  protected fixCurrentPosition(): void {
    const targetX = this.getIsShowing() ? '0px' : `${this.getOffScreenX()}px`;
    this.sidebar().nativeElement.style.transform = `translateX(${targetX})`;
  }

  public async fadeSidebar(fadeOut: boolean, duration: number): Promise<void> {
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
    if (this.isInAnimation) return;
    this.isInAnimation = true;

    const direction = this.getIsShowing() ? 'reverse' : 'normal';
    anime({
      targets: this.sidebar().nativeElement,
      easing: 'easeInOutQuint',
      translateX: [`${this.getOffScreenX()}px`, 0],
      direction,
      duration,
      complete: () => {
        this.isInAnimation = false;
      },
    });
  }
}
