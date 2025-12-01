import { Component, Input, OnInit } from '@angular/core';
import { PlaybackService } from '../services/playback/playback.service';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatAnimatedIconComponent } from '../mat-animated-icon/mat-animated-icon.component';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var anime: any;

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
  @Input() algorithm: string;

  constructor(public playback: PlaybackService) {}

  ngOnInit(): void {}

  formatLabel(value: number) {
    // pause
    value = 3050 - value;
    // play? (maybe not cause so many changes to this.timeInBetween value)

    if (value >= 1000) {
      return Math.round(value / 1000) + 's';
    }

    return value;
  }

  updateSpeed(val: number): void {
    this.playback.speed = 3050 - val;
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
