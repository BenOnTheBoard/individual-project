import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'mat-animated-icon',
  templateUrl: './mat-animated-icon.component.html',
  styleUrls: ['./mat-animated-icon.component.scss'],
  imports: [MatIcon, NgClass],
})
export class MatAnimatedIconComponent implements OnInit {
  @Input() start: String;
  @Input() end: String;
  @Input() colorStart: String;
  @Input() colorEnd: String;
  @Input() animate: boolean;
  @Input() animateFromParent?: boolean = false;

  constructor() {}

  ngOnInit() {
    // console.log(this.colorStart);
    // console.log(this.colorEnd);
  }

  toggle() {
    if (!this.animateFromParent) this.animate = !this.animate;
  }
}
