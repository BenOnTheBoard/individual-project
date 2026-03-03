import { Component, ElementRef, viewChild, input, inject } from '@angular/core';
import { AlgDescriptionComponent } from './alg-description/alg-description.component';
import { PseudocodeComponent } from './pseudocode/pseudocode.component';
import { FreeAgentsComponent } from './free-agents/free-agents.component';
import { ExecutionLogComponent } from './execution-log/execution-log.component';
import { NgClass } from '@angular/common';
import { AbstractSidebarComponent } from '../abstract-sidebar/abstract-sidebar.component';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval/algorithm-retrieval.service';
import { MarkedAgentsComponent } from './marked-agents/marked-agents.component';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [
    ExecutionLogComponent,
    FreeAgentsComponent,
    MarkedAgentsComponent,
    PseudocodeComponent,
    AlgDescriptionComponent,
    NgClass,
  ],
})
export class SidebarComponent extends AbstractSidebarComponent {
  protected isCodeShowing = input<boolean>(undefined);
  protected sidebar = viewChild<ElementRef>('sidebarContainer');
  protected algRetriever = inject(AlgorithmRetrievalService);

  constructor() {
    super();
    this.setSide('left');
  }

  getIsShowing(): boolean {
    return this.isCodeShowing();
  }

  marksAgent(): boolean {
    return this.algRetriever.marksAgents(this.algRetriever.currentAlgorithm.id);
  }
}
