import { Component, inject, OnInit } from '@angular/core';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval/algorithm-retrieval.service';
import { PlaybackService } from '../../services/playback/playback.service';

@Component({
  selector: 'pseudocode',
  templateUrl: './pseudocode.component.html',
  styleUrls: ['./pseudocode.component.scss', '../sidebar.component.scss'],
})
export class PseudocodeComponent implements OnInit {
  algorithm: string;
  animate: boolean = true;
  protected algRetriever = inject(AlgorithmRetrievalService);
  protected playback = inject(PlaybackService);

  ngOnInit(): void {
    this.algorithm = this.algRetriever.currentAlgorithm.id;
  }
}
