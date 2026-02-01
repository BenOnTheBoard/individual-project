import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
declare var anime: any; // declaring the animejs animation library for use in this file

@Component({
  selector: 'app-info-sidebar',
  templateUrl: './info-sidebar.component.html',
  styleUrls: ['./info-sidebar.component.scss'],
})
export class InfoSidebarComponent implements OnInit {
  @Input() isInfoShowing: boolean;
  @Input() tutorialStep: number;

  @ViewChild('sidebarContainer', { static: true })
  private sidebar: ElementRef;
  private sidebarWidth: number;

  private isInAnimation: boolean;

  constructor(public algorithmService: AlgorithmRetrievalService) {}

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
    const targetX = this.isInfoShowing ? '0px' : `${this.sidebarWidth}px`;
    this.sidebar.nativeElement.style.transform = `translateX(${targetX})`;
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

  public async toggleSidebar(duration: number): Promise<void> {
    if (this.isInAnimation) return;
    this.isInAnimation = true;

    const direction = this.isInfoShowing ? 'reverse' : 'normal';
    anime({
      targets: this.sidebar.nativeElement,
      easing: 'easeInOutQuint',
      translateX: [`${this.sidebarWidth}px`, 0],
      direction: direction,
      duration: duration,
      complete: () => {
        this.isInAnimation = false;
      },
    });
  }
}
