import { Component, inject, OnInit } from '@angular/core';
import { PlaybackService } from '../../services/playback/playback.service';

@Component({
  selector: 'alg-description',
  templateUrl: './alg-description.component.html',
  styleUrls: ['./alg-description.component.scss', '../sidebar.component.scss'],
})
export class AlgDescriptionComponent implements OnInit {
  protected playback = inject(PlaybackService);

  ngOnInit(): void {}
}
