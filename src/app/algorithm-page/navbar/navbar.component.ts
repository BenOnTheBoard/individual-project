import { Component, input, OnInit, output } from '@angular/core';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
import { CanvasService } from '../services/canvas/canvas.service';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { AnimationGuideDialogComponent } from '../animation-guide-dialog/animation-guide-dialog.component';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'alg-page-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [MatIconModule, MatTooltip, BrowserModule],
})
export class NavbarComponent implements OnInit {
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
