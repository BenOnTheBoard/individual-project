import { Component, OnInit, inject, input } from '@angular/core';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
import { PlaybackService } from '../services/playback/playback.service';

@Component({
  selector: 'agent-titles',
  templateUrl: './agent-titles.component.html',
  styleUrls: ['./agent-titles.component.scss'],
})
export class AgentTitlesComponent implements OnInit {
  readonly isCodeShowing = input<boolean>(undefined);
  protected playback = inject(PlaybackService);
  protected algRetriever = inject(AlgorithmRetrievalService);

  ngOnInit(): void {}
}
