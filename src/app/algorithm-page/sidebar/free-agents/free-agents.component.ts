import { Component, inject } from '@angular/core';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval/algorithm-retrieval.service';
import { PlaybackService } from '../../services/playback/playback.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'free-agents',
  templateUrl: './free-agents.component.html',
  styleUrls: ['./free-agents.component.scss', '../sidebar.component.scss'],
})
export class FreeAgentsComponent {
  protected algRetriever = inject(AlgorithmRetrievalService);
  protected playback = inject(PlaybackService);
  protected utils = inject(UtilsService);

  getFreeAgentString(): string {
    const { freeAgents } = this.playback.getCurrentStep();
    return `[ ${freeAgents.map((agent) => this.utils.getAsChar(agent)).join(', ')} ]`;
  }
}
