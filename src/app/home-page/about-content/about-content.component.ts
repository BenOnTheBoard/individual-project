import { Component, ChangeDetectionStrategy } from '@angular/core';
import { simpleFadeAnimation } from 'src/app/animations/fadeAnimation';

@Component({
  selector: 'app-about-content',
  templateUrl: './about-content.component.html',
  styleUrls: [
    './about-content.component.scss',
    '../home-page.component.scss',
    '../home-content/home-content.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  animations: [simpleFadeAnimation],
})
export class AboutContentComponent {}
