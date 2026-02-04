import { Component, OnInit, input } from '@angular/core';
import { PlaybackService } from '../services/playback/playback.service';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatAnimatedIconComponent } from '../mat-animated-icon/mat-animated-icon.component';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'playback-controls',
  templateUrl: './playback-controls.component.html',
  styleUrls: ['./playback-controls.component.scss'],
  imports: [
    MatAnimatedIconComponent,
    MatIconModule,
    MatSliderModule,
    NgClass,
    FormsModule,
  ],
})
export class PlaybackControlsComponent implements OnInit {
  readonly algorithm = input<string>(undefined);

  constructor(public playback: PlaybackService) {}

  ngOnInit(): void {}

  formatLabel(value: number): string {
    value = 3050 - value;
    return value >= 1000 ? `${Math.round(value / 1000)}s` : `${value}ms`;
  }

  updateSpeed(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    this.playback.setSpeed(3050 - value);
  }

  onStepSliderInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    this.playback.jumpToStep(value);
  }

  onStepSliderChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    this.playback.jumpToStep(value);
    this.playback.onSliderChange(value);
  }
}
