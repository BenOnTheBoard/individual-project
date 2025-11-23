import { Component, Input, OnInit } from '@angular/core';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
import { PlaybackService } from '../../services/playback/playback.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'agent-titles',
  templateUrl: './agent-titles.component.html',
  styleUrls: ['./agent-titles.component.scss'],
  imports:[NgIf],
})
export class AgentTitlesComponent implements OnInit {

  @Input() showCode: boolean;

  constructor(public algorithmService: AlgorithmRetrievalService, public playback: PlaybackService) { }

  ngOnInit(): void {
  }

}
