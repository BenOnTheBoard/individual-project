import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { simpleFadeAnimation } from 'src/app/animations/fadeAnimation';

declare var anime: any;

@Component({
  selector: 'home-content',
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.scss', '../home-page.component.scss'],
  animations: [simpleFadeAnimation],
})
export class HomeContentComponent implements OnInit {
  @ViewChild('animationVid') animationVid: ElementRef;
  @ViewChild('descriptionVid') descriptionVid: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  private async playVideo(video: HTMLVideoElement): Promise<void> {
    try {
      video.muted = true;
      let playPromise = video.play();
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
    this.playVideo(this.animationVid.nativeElement);
    this.playVideo(this.descriptionVid.nativeElement);
  }
}
