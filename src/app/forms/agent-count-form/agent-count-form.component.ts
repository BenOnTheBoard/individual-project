import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Algorithm } from 'src/app/algorithm-retrieval/Algorithm';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval/algorithm-retrieval.service';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-agent-count-form',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './agent-count-form.component.html',
})
export class AgentCountFormComponent {
  readonly algorithm = input<Algorithm>(undefined);
  readonly enterEvent = output();

  #SR = ['smp-room-irv'];
  #SM = ['smp-man-gs', 'smp-man-egs', 'smt-super-man'];
  #HR = ['hr-resident-egs', 'hr-hospital-egs', 'hrt-super-res'];
  #SPAS = ['spa-stu-egs'];

  #singleForm = [...this.#SM];
  #doubleForm = [...this.#HR, ...this.#SPAS];

  protected algRetriever = inject(AlgorithmRetrievalService);

  protected numberOfG1Agents = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(1),
    Validators.max(9),
  ]);

  protected numberOfG2Agents = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(1),
    Validators.max(9),
  ]);

  protected numberOfSRAgents = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(4),
    Validators.max(8),
    UtilsService.validateEven(),
  ]);

  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.isFormValid()) {
      this.enterEvent.emit(null);
    }
  }

  isFormValid(): boolean {
    switch (this.getFormType()) {
      case 'single':
        return this.numberOfG1Agents.valid;
      case 'double':
        return this.numberOfG1Agents.valid && this.numberOfG2Agents.valid;
      case 'SR':
        return this.numberOfSRAgents.valid;
      default:
        return false;
    }
  }

  getG1AgentCount(): number {
    return this.numberOfG1Agents.value;
  }

  getG2AgentCount(): number {
    return this.numberOfG2Agents.value;
  }

  getSRAgentCount(): number {
    return this.numberOfSRAgents.value;
  }

  getSide(proposing: boolean) {
    const { id } = this.algorithm();
    let sides: [string, string];
    if (this.#SR.includes(id)) sides = ['People', 'People'];
    if (this.#SM.includes(id)) sides = ['Men', 'Women'];
    if (this.#HR.includes(id)) sides = ['Residents', 'Hospitals'];
    if (this.#SPAS.includes(id)) sides = ['Students', 'Projects'];
    return sides[proposing ? 0 : 1];
  }

  getFormType(): 'single' | 'double' | 'SR' {
    const { id } = this.algorithm();
    if (this.#singleForm.includes(id)) return 'single';
    if (this.#doubleForm.includes(id)) return 'double';
    if (this.#SR.includes(id)) return 'SR';
    throw Error(`Form type not specified: ${id}`);
  }
}
