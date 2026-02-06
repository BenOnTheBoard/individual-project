import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-animation-guide-dialog',
  templateUrl: './animation-guide-dialog.component.html',
  styleUrls: ['./animation-guide-dialog.component.scss'],
  imports: [MatDialogModule, MatButtonModule],
})
export class AnimationGuideDialogComponent {}
