import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { PlaybackService } from '../../services/playback/playback.service';

@Component({
  selector: 'alg-description',
  templateUrl: './alg-description.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./alg-description.component.scss', '../sidebar.component.scss'],
})
export class AlgDescriptionComponent {
  protected playback = inject(PlaybackService);
}
