import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-animation-guide-dialog',
  templateUrl: './animation-guide-dialog.component.html',
  styleUrls: ['./animation-guide-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogModule, MatButtonModule],
})
export class AnimationGuideDialogComponent {}
