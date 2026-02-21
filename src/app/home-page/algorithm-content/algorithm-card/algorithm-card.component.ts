import { Component, viewChild, input, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval/algorithm-retrieval.service';
import { Algorithm } from '../../../algorithm-retrieval/Algorithm';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UtilsService } from 'src/app/utils/utils.service';
import { AgentCountFormComponent } from 'src/app/forms/agent-count-form/agent-count-form.component';
import anime from 'animejs/lib/anime.es.js';

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
export class AlgorithmCardComponent {
  readonly algorithm = input<Algorithm>(undefined);
  protected readonly agentForm = viewChild(AgentCountFormComponent);

  protected algRetriever = inject(AlgorithmRetrievalService);
  protected router = inject(Router);
  protected utils = inject(UtilsService);

  async onGeneratePrefs(): Promise<void> {
    // change the global algorithm to the one passed into this dialog
    this.algRetriever.currentAlgorithm = this.algorithm();

    const isRoommates = this.algRetriever.currentAlgorithm.id == 'smp-room-irv';
    this.algRetriever.numberOfG1Agents = isRoommates
      ? this.agentForm().getSRAgentCount()
      : this.agentForm().getG1AgentCount();

    const specifiesG2Count = !this.agentForm().getG2AgentCount();
    this.algRetriever.numberOfG2Agents = specifiesG2Count
      ? this.agentForm().getG1AgentCount()
      : this.agentForm().getG2AgentCount();

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

    await this.utils.delay(600);
    this.router.navigateByUrl('/animation', { skipLocationChange: true });
  }
}
