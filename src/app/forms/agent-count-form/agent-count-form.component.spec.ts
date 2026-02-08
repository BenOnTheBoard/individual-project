import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentCountFormComponent } from './agent-count-form.component';
import {
  Algorithm,
  AlgorithmBuilder,
} from 'src/app/algorithm-retrieval/Algorithm';

describe('AgentCountForm', () => {
  let component: AgentCountFormComponent;
  let fixture: ComponentFixture<AgentCountFormComponent>;

  const mockAlgorithm: Algorithm = new AlgorithmBuilder().build();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentCountFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentCountFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('algorithm', mockAlgorithm);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
