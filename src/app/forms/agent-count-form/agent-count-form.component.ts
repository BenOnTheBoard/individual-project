import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Algorithm } from 'src/app/Algorithm';
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
export class AgentCountFormComponent implements OnInit {
  readonly algorithm = input<Algorithm>(undefined);
  readonly enterEvent = output();

  protected numberOfGroup1Agents = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(1),
    Validators.max(9),
  ]);

  protected numberOfGroup2Agents = new FormControl<number | null>(null, [
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

  ngOnInit(): void {}

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
        return this.numberOfGroup1Agents.valid;
      case 'Hospitals/Residents Problem':
      case 'Student-Project Allocation':
        return (
          this.numberOfGroup1Agents.valid && this.numberOfGroup2Agents.valid
        );
      case 'Stable Roommates Problem':
        return this.numberOfSRAgents.valid;
      default:
        return false;
    }
  }

  getGroup1AgentCount(): number {
    return this.numberOfGroup1Agents.value;
  }

  getGroup2AgentCount(): number {
    return this.numberOfGroup2Agents.value;
  }

  getSRAgentCount(): number {
    return this.numberOfSRAgents.value;
  }
}
