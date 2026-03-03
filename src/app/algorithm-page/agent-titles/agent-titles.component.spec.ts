import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AgentTitlesComponent } from './agent-titles.component';
import { mockAlgorithmRetrievalService } from 'src/app/mock-services/algorithm-retrieval.mock';

describe('AgentTitlesComponent', () => {
  let component: AgentTitlesComponent;
  let fixture: ComponentFixture<AgentTitlesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AgentTitlesComponent],
      providers: [mockAlgorithmRetrievalService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentTitlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
