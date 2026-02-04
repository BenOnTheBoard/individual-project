import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IconBannerComponent } from './icon-banner/icon-banner.component';
import { NavbarComponent } from './navbar/navbar.component';
declare var anime: any;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [NavbarComponent, IconBannerComponent, RouterOutlet],
})
export class HomePageComponent {
  protected router = inject(Router);

  async ngAfterViewInit(): Promise<void> {
    anime({
      targets: '.navbar',
      easing: 'easeInOutQuint',
      translateY: [-150, 0],
      opacity: [0, 1],
      delay: 100,
      duration: 1000,
    });

    anime({
      targets: '.main-page',
      easing: 'easeInOutQuint',
      opacity: [0, 1],
      delay: 550,
      duration: 900,
    });
  }
}
