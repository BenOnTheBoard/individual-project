import { Component, OnInit } from '@angular/core';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
import { simpleFadeAnimation } from 'src/app/animations/fadeAnimation';
import { AlgorithmCardComponent } from './algorithm-card/algorithm-card.component';

@Component({
  selector: 'app-algorithm-content',
  templateUrl: './algorithm-content.component.html',
  styleUrls: ['./algorithm-content.component.scss', '../home-page.component.scss', '../home-content/home-content.component.scss'],
  animations: [
    simpleFadeAnimation
  ],
  imports:[AlgorithmCardComponent],
})
export class AlgorithmContentComponent implements OnInit {

  constructor(public algorithmRetrieval: AlgorithmRetrievalService) { }

  ngOnInit(): void {
  }

}
