import { Component, inject } from '@angular/core';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval/algorithm-retrieval.service';
import { PlaybackService } from '../../services/playback/playback.service';
import { UtilsService } from 'src/app/utils/utils.service';
import { Agent } from 'src/app/algorithms/interfaces/Agents';

@Component({
  selector: 'marked-agents',
  templateUrl: './marked-agents.component.html',
  styleUrls: ['./marked-agents.component.scss', '../sidebar.component.scss'],
})
export class MarkedAgentsComponent {
  protected algRetriever = inject(AlgorithmRetrievalService);
  protected playback = inject(PlaybackService);
  protected utils = inject(UtilsService);

  getMarkedAgentString(): string {
    const { algorithmSpecificData } = this.playback.getCurrentStep();
    const marked: Array<Agent<any>> = algorithmSpecificData['markedAgents'];
    return `[ ${marked.map((agent) => this.utils.getAsChar(agent)).join(', ')} ]`;
  }
}
