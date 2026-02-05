import {
  Component,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
import { CanvasService } from '../services/canvas/canvas.service';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { AnimationGuideDialogComponent } from '../animation-guide-dialog/animation-guide-dialog.component';
declare var anime: any; // declaring the animejs animation library for use in this file

@Component({
  selector: 'alg-page-navbar',
  templateUrl: './alg-page-navbar.component.html',
  styleUrl: './alg-page-navbar.component.scss',
  imports: [MatIconModule, MatTooltip, CommonModule],
})
export class AlgPageNavbarComponent {
  protected duringAnimation = input<boolean>();
  protected isCodeShowing = input<boolean>();
  protected isInfoShowing = input<boolean>();
  protected SRStable = input<boolean>();
  protected step = 0;

  // for instructions to page
  protected commandEmitter = output<string>();
  // for delivering navbar info to page
  protected dialogOpenEmitter = output<boolean>();
  protected tutorialStepEmitter = output<number>();

  private navbar = viewChild<ElementRef>('algPageNavbar');
  // unlike sidebar width, navbar height won't change
  #isInAnimation = false;

  protected algRetriever = inject(AlgorithmRetrievalService);
  protected drawService = inject(CanvasService);
  protected dialog = inject(MatDialog);

  protected updateTutorialStep(step: number): void {
    this.step = step;
    this.tutorialStepEmitter.emit(this.step);
  }

  protected emitToPage(command: string) {
    this.commandEmitter.emit(command);
  }

  protected updateToNextTutorialStep() {
    this.updateTutorialStep((this.step + 1) % 4);
  }

  protected getTitle(): string {
    const { name, algorithm } = this.algRetriever.currentAlgorithm;
    const optimisedSide = this.algRetriever.getSide(true, false);
    return `${name} / ${algorithm} / ${optimisedSide}-Oriented`;
  }

  protected openAnimationGuideDialog(): void {
    this.dialogOpenEmitter.emit(true);
    const dialogRef = this.dialog.open(AnimationGuideDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.dialogOpenEmitter.emit(false);
    });
  }

  protected refreshCanvas(): void {
    this.drawService.alwaysShowPreferences =
      !this.drawService.alwaysShowPreferences;
    this.drawService.redrawCanvas();
  }

  public async toggleNavbar(fadeOut: boolean, duration: number): Promise<void> {
    if (this.#isInAnimation) return;
    this.#isInAnimation = true;

    const direction = fadeOut ? 'reverse' : 'normal';
    const barHeight = this.navbar().nativeElement.offsetHeight;
    anime({
      targets: this.navbar().nativeElement,
      easing: 'easeOutQuint',
      translateY: [`-${barHeight}px`, 0],
      direction,
      duration,
      complete: () => {
        this.#isInAnimation = false;
      },
    });
  }
}
