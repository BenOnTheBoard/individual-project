import { Component, ElementRef, viewChild } from '@angular/core';
import { simpleFadeAnimation } from 'src/app/animations/fadeAnimation';

@Component({
  selector: 'home-content',
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.scss', '../home-page.component.scss'],
  animations: [simpleFadeAnimation],
})
export class HomeContentComponent {
  private animationVid = viewChild<ElementRef>('animationVid');
  private descriptionVid = viewChild<ElementRef>('descriptionVid');

  async #playVideo(video: HTMLVideoElement): Promise<void> {
    try {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Play interrupted (media removed/expected)');
      } else {
        console.error('Video play failed:', error);
      }
    }
  }

  ngAfterViewInit() {
    this.#playVideo(this.animationVid().nativeElement);
    this.#playVideo(this.descriptionVid().nativeElement);
  }
}
