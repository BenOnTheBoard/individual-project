import { Component, inject, OnInit } from '@angular/core';
import { PlaybackService } from '../../services/playback/playback.service';

@Component({
  selector: 'execution-log',
  templateUrl: './execution-log.component.html',
  styleUrls: ['./execution-log.component.scss', '../sidebar.component.scss'],
})
export class ExecutionLogComponent implements OnInit {
  protected playback = inject(PlaybackService);

  ngOnInit(): void {}
}
