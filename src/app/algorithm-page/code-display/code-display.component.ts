import { Component, Input, OnInit } from '@angular/core';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
import { PlaybackService } from '../services/playback/playback.service';
import { NgIf } from '@angular/common';

declare var anime: any;

@Component({
  selector: 'code-display',
  templateUrl: './code-display.component.html',
  styleUrls: ['./code-display.component.scss', '../sidebar/sidebar.component.scss'],
  imports: [NgIf],
})
export class CodeDisplayComponent implements OnInit {

  algorithm: string;
  animate: boolean = true;

  constructor(public playback: PlaybackService, public algService: AlgorithmRetrievalService) { }

  ngOnInit(): void {
    this.algorithm = this.algService.currentAlgorithm.id;
  }

}
