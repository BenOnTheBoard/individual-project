import {
  Component,
  inject,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval/algorithm-retrieval.service';
import { PlaybackService } from '../services/playback/playback.service';

@Component({
  selector: 'agent-titles',
  templateUrl: './agent-titles.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./agent-titles.component.scss'],
})
export class AgentTitlesComponent {
  readonly isCodeShowing = input<boolean>(undefined);
  protected playback = inject(PlaybackService);
  protected algRetriever = inject(AlgorithmRetrievalService);
}
