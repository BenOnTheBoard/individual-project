import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { PlaybackService } from '../../services/playback/playback.service';

@Component({
  selector: 'execution-log',
  templateUrl: './execution-log.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./execution-log.component.scss', '../sidebar.component.scss'],
})
export class ExecutionLogComponent {
  protected playback = inject(PlaybackService);
}
