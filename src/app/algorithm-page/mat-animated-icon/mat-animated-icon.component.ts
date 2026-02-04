import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'mat-animated-icon',
  templateUrl: './mat-animated-icon.component.html',
  styleUrls: ['./mat-animated-icon.component.scss'],
  imports: [MatIcon, NgClass],
})
export class MatAnimatedIconComponent {
  readonly start = input<String>(undefined);
  readonly end = input<String>(undefined);
  readonly colorStart = input<String>(undefined);
  readonly colorEnd = input<String>(undefined);
  readonly animate = input<boolean>(undefined);
  readonly animateFromParent = input<boolean>(false);

  #internalAnimate = false;

  toggle() {
    if (!this.animateFromParent()) {
      this.#internalAnimate = !this.#internalAnimate;
    }
  }
}
