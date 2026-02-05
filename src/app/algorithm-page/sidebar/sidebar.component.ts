import { Component, ElementRef, viewChild, input } from '@angular/core';
import { AlgDescriptionComponent } from './alg-description/alg-description.component';
import { PseudocodeComponent } from './pseudocode/pseudocode.component';
import { FreeAgentsComponent } from './free-agents/free-agents.component';
import { ExecutionLogComponent } from './execution-log/execution-log.component';
import { NgClass } from '@angular/common';
import { AbstractSidebarComponent } from '../abstract-sidebar/abstract-sidebar.component';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [
    ExecutionLogComponent,
    FreeAgentsComponent,
    PseudocodeComponent,
    AlgDescriptionComponent,
    NgClass,
  ],
})
export class SidebarComponent extends AbstractSidebarComponent {
  protected isCodeShowing = input<boolean>(undefined);
  protected sidebar = viewChild<ElementRef>('sidebarContainer');

  constructor() {
    super();
    this.setSide('left');
  }

  getIsShowing(): boolean {
    return this.isCodeShowing();
  }
}
