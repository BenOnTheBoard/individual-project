import { Injectable } from '@angular/core';
declare var anime: any; // declaring the animejs animation library for use in this file

@Injectable({
  providedIn: 'root',
})
export class AlgorithmAnimationService {
  constructor() {}

  loadPage(): void {
    // animation for sliding the navbar down from Y-150 its position
    anime({
      targets: '.navbar',
      easing: 'easeOutQuint',
      translateY: [-150, 0],
      delay: 200,
      duration: 900,
    });

    // animation for fading the main content in as the sidebar finishes sliding in
    anime({
      targets: '#mainContent',
      easing: 'easeInOutQuint',
      opacity: [0, 1],
      delay: 670,
      duration: 900,
    });
  }

  goHome(): void {
    anime({
      targets: '.navbar',
      easing: 'easeOutQuint',
      translateY: [0, -150],
      delay: 400,
      duration: 900,
    });

    anime({
      targets: '#mainContent',
      easing: 'easeInOutQuint',
      opacity: [1, 0],
      duration: 600,
    });
  }

  fadeCanvasOut(): void {
    anime({
      targets: '#myCanvas',
      easing: 'easeInOutQuint',
      opacity: [1, 0],
      duration: 300,
    });
  }

  fadeCanvasIn(): void {
    anime({
      targets: '#myCanvas',
      easing: 'easeInOutQuint',
      opacity: [0, 1],
      duration: 300,
    });
  }

  hideMainContent(): void {
    anime({
      targets: '#mainContent',
      easing: 'easeInOutQuint',
      opacity: [1, 0],
      duration: 500,
    });
  }

  showMainContent(): void {
    anime({
      targets: '#mainContent',
      easing: 'easeInOutQuint',
      opacity: [0, 1],
      duration: 500,
    });
  }
}
