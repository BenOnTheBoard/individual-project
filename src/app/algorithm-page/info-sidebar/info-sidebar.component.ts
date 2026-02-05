import { Component, ElementRef, viewChild, input, inject } from '@angular/core';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
import { AbstractSidebarComponent } from '../abstract-sidebar/abstract-sidebar.component';

@Component({
  selector: 'app-info-sidebar',
  templateUrl: './info-sidebar.component.html',
  styleUrls: ['./info-sidebar.component.scss'],
})
export class InfoSidebarComponent extends AbstractSidebarComponent {
  protected isInfoShowing = input<boolean>(undefined);
  protected sidebar = viewChild<ElementRef>('sidebarContainer');

  protected algRetriever = inject(AlgorithmRetrievalService);

  constructor() {
    super();
    this.setSide('right');
  }

  getIsShowing(): boolean {
    return this.isInfoShowing();
  }
}
