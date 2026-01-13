import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
import { Algorithm } from '../../../Algorithm';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UtilsService } from 'src/app/utils/utils.service';

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
  ],
})
export class AlgorithmCardComponent implements OnInit {
  @Input() algorithm: Algorithm;

  numberOfGroup1Agents = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(1),
    Validators.max(9),
  ]);

  numberOfGroup2Agents = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(1),
    Validators.max(9),
  ]);

  numberOfSRAgents = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(1),
    Validators.max(8),
    UtilsService.validateEven(),
  ]);

  constructor(
    public algorithmService: AlgorithmRetrievalService,
    public utils: UtilsService,
    public router: Router
  ) {}

  ngOnInit(): void {}

  hasGroup1Error(): boolean {
    return !(this.numberOfGroup1Agents.errors === null);
  }

  hasGroup2Error(): boolean {
    return !(this.numberOfGroup2Agents.errors === null);
  }

  hasSRError(): boolean {
    return !(this.numberOfSRAgents.errors === null);
  }

  async onGeneratePreferences(): Promise<void> {
    // change the global algorithm to the one passed into this dialog
    this.algorithmService.currentAlgorithm = this.algorithm;

    this.algorithmService.numberOfGroup1Agents =
      this.algorithmService.currentAlgorithm.id == 'smp-room-irv'
        ? this.numberOfSRAgents.value
        : this.numberOfGroup1Agents.value;

    const specifiesGroup2Count = !this.numberOfGroup2Agents.value;
    this.algorithmService.numberOfGroup2Agents = specifiesGroup2Count
      ? this.numberOfGroup1Agents.value
      : this.numberOfGroup2Agents.value;

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
