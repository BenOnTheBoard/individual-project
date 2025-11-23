import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IconBannerComponent } from './icon-banner/icon-banner.component';
import { FeedbackBannerComponent } from './feedback-banner/feedback-banner.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgIf } from '@angular/common';

declare var anime: any;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports:[
    NavbarComponent,
    IconBannerComponent,
    FeedbackBannerComponent,
    RouterOutlet,
    NgIf,
  ],
})
export class HomePageComponent implements OnInit {

  

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  async ngAfterViewInit(): Promise<void> {

    anime({
      targets: '.navbar',
      easing: 'easeInOutQuint',
      translateY: [-150, 0],
      opacity: [0, 1],
      delay: 100,
      duration: 1000
    })

    anime({
      targets: '.main-page',
      easing: 'easeInOutQuint',
      opacity: [0, 1],
      // translateY: [-100, 0],
      delay: 550,
      duration: 900
    })


  }


}
