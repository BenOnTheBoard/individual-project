import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
import { Algorithm } from '../../../Algorithm';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UtilsService } from 'src/app/utils/utils.service';
import { AgentCountFormComponent } from 'src/app/forms/agent-count-form/agent-count-form.component';

declare var anime: any;

@Component({
  selector: 'algorithm-card',
  templateUrl: './algorithm-card.component.html',
  styleUrls: [
    './algorithm-card.component.scss',
    '../../home-page.component.scss',
    '../../home-content/home-content.component.scss',
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    AgentCountFormComponent,
  ],
})
export class AlgorithmCardComponent implements OnInit {
  @Input() algorithm: Algorithm;
  @ViewChild(AgentCountFormComponent, { static: true })
  protected agentForm!: AgentCountFormComponent;

  constructor(
    public algRetriever: AlgorithmRetrievalService,
    public utils: UtilsService,
    public router: Router
  ) {}

  ngOnInit(): void {}

  async onGeneratePreferences(): Promise<void> {
    // change the global algorithm to the one passed into this dialog
    this.algRetriever.currentAlgorithm = this.algorithm;

    const isRoommates = this.algRetriever.currentAlgorithm.id == 'smp-room-irv';
    this.algRetriever.numberOfGroup1Agents = isRoommates
      ? this.agentForm.getSRAgentCount()
      : this.agentForm.getGroup1AgentCount();

    const specifiesGroup2Count = !this.agentForm.getGroup2AgentCount();
    this.algRetriever.numberOfGroup2Agents = specifiesGroup2Count
      ? this.agentForm.getGroup1AgentCount()
      : this.agentForm.getGroup2AgentCount();

    anime({
      targets: '.main-page',
      easing: 'easeOutQuint',
      opacity: [1, 0],
      duration: 500,
    });

    anime({
      targets: '.navbar',
      easing: 'easeOutQuint',
      translateY: [0, -150],
      opacity: [1, 0],
      delay: 300,
      duration: 500,
    });

    await this.utils.delay(700);
    this.router.navigateByUrl('/animation', { skipLocationChange: true });
  }
}
