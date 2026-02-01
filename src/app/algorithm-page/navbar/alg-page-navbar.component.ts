import { Component, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
import { CanvasService } from '../services/canvas/canvas.service';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { AnimationGuideDialogComponent } from '../animation-guide-dialog/animation-guide-dialog.component';

@Component({
  selector: 'alg-page-navbar',
  templateUrl: './alg-page-navbar.component.html',
  styleUrl: './alg-page-navbar.component.scss',
  imports: [MatIconModule, MatTooltip, CommonModule],
})
export class AlgPageNavbarComponent implements OnInit {
  duringAnimation = input<boolean>();

  showCode = false;
  showInfo = false;
  SRStable = true;
  step = 0;

  // for instructions to page
  commandEmitter = output<string>();
  // delivering info to page
  dialogOpenEmitter = output<boolean>();
  SRStableEmitter = output<boolean>();
  tutorialStepEmitter = output<number>();

  constructor(
    public algorithmService: AlgorithmRetrievalService,
    public drawService: CanvasService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {}

  updateTutorialStep(step: number): void {
    this.step = step;
    this.tutorialStepEmitter.emit(this.step);
  }

  updateToNextTutorialStep() {
    this.updateTutorialStep((this.step + 1) % 4);
  }

  toggleLeftSidebar(): void {
    this.showCode = !this.showCode;
    this.commandEmitter.emit('toggleLeftSidebar');
  }

  toggleRightSidebar(): void {
    this.showInfo = !this.showInfo;
    this.commandEmitter.emit('toggleRightSidebar');
  }

  toggleSRStable(): void {
    this.SRStable = !this.SRStable;
    this.SRStableEmitter.emit(this.SRStable);
  }

  emitGoHome(): void {
    this.commandEmitter.emit('goHome');
  }

  emitGeneratePreferences(): void {
    this.commandEmitter.emit('generatePreferences');
  }

  getTitle(): string {
    const name = this.algorithmService.currentAlgorithm.name;
    const algorithm = this.algorithmService.currentAlgorithm.algorithm;
    const optimisedSide = this.algorithmService.getSide(true, false);
    return `${name} / ${algorithm} / ${optimisedSide}-Oriented`;
  }

  openAnimationGuideDialog(): void {
    this.dialogOpenEmitter.emit(true);
    const dialogRef = this.dialog.open(AnimationGuideDialogComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.dialogOpenEmitter.emit(false);
    });
  }

  refreshCanvas(): void {
    this.drawService.alwaysShowPreferences =
      !this.drawService.alwaysShowPreferences;
    this.drawService.redrawCanvas();
  }
}
