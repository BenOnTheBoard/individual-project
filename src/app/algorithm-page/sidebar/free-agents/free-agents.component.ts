import { Component, OnInit } from '@angular/core';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
import { PlaybackService } from '../../services/playback/playback.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'free-agents',
  templateUrl: './free-agents.component.html',
  styleUrls: ['./free-agents.component.scss', '../sidebar.component.scss'],
})
export class FreeAgentsComponent implements OnInit {
  constructor(
    public playback: PlaybackService,
    public algRetriever: AlgorithmRetrievalService,
    public utils: UtilsService,
  ) {}

  ngOnInit(): void {}

  getFreeAgentString(): string {
    const freeAgents: string[] =
      this.playback.commandList[this.playback.stepCounter]['freeAgents'];
    return freeAgents.map((item) => item.slice(-1)).join(', ');
  }
}
