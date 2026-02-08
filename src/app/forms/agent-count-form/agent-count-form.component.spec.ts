import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentCountFormComponent } from './agent-count-form.component';
import { Algorithm } from 'src/app/algorithm-retrieval/Algorithm';

describe('AgentCountForm', () => {
  let component: AgentCountFormComponent;
  let fixture: ComponentFixture<AgentCountFormComponent>;

  const mockAlgorithm: Algorithm = {
    id: '1',
    name: '',
    orientation: [],
    equalGroups: true,
    algorithm: '',
    service: {} as any,
    description: '',
    helpTextMap: {},
    code: [],
  };

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
