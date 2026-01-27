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
import { UtilsService } from 'src/app/utils/utils.service';
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

  @ViewChild('sidebarContent')
  private sidebarContent: ElementRef;

  private isInAnimation: boolean;

  constructor(private utils: UtilsService) {}

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

  private hideSidebar(): void {
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

  private showSidebar(): void {
    anime({
      targets: this.sidebar.nativeElement,
      easing: 'easeInOutQuint',
      translateX: [`-${this.sidebarWidth}px`, 0],
      duration: 600,
      complete: () => {
        this.isInAnimation = false;
      },
    });

    anime({
      targets: this.sidebarContent.nativeElement,
      easing: 'easeInOutQuint',
      opacity: [0, 1],
      duration: 600,
    });
  }

  async toggleSidebar(): Promise<void> {
    if (this.isInAnimation) return;
    this.isInAnimation = true;

    if (!this.showCode) {
      this.hideSidebar();
      await this.utils.delay(700);
    } else {
      await this.utils.delay(400);
      this.showSidebar();
      await this.utils.delay(200);
    }
  }
}
