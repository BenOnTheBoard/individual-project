import { Component, inject } from '@angular/core';
import { PlaybackService } from '../../services/playback/playback.service';

@Component({
  selector: 'alg-description',
  templateUrl: './alg-description.component.html',
  styleUrls: ['./alg-description.component.scss', '../sidebar.component.scss'],
})
export class AlgDescriptionComponent {
  protected playback = inject(PlaybackService);
}
