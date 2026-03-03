import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentCountFormComponent } from './agent-count-form.component';
import {
  Algorithm,
  AlgorithmBuilder,
} from 'src/app/algorithm-retrieval/Algorithm';
import { mockAlgorithmRetrievalService } from 'src/app/mock-services/algorithm-retrieval.mock';

describe('AgentCountForm', () => {
  let component: AgentCountFormComponent;
  let fixture: ComponentFixture<AgentCountFormComponent>;

  const mockAlgorithm: Algorithm = new AlgorithmBuilder()
    .id('smp-man-gs')
    .build();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentCountFormComponent],
      providers: [mockAlgorithmRetrievalService],
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
