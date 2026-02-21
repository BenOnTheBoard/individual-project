import { CommonModule } from '@angular/common';
import { Component, HostListener, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Algorithm } from 'src/app/algorithm-retrieval/Algorithm';
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
    Validators.min(1),
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
    switch (this.algorithm().name) {
      case 'Stable Marriage Problem':
        return this.numberOfG1Agents.valid;
      case 'Hospitals/Residents Problem':
      case 'Student-Project Allocation':
        return this.numberOfG1Agents.valid && this.numberOfG2Agents.valid;
      case 'Stable Roommates Problem':
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
}
