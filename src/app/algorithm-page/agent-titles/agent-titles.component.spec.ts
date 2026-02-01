import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgentTitlesComponent } from './agent-titles.component';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';

describe('AgentTitlesComponent', () => {
  let component: AgentTitlesComponent;
  let fixture: ComponentFixture<AgentTitlesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AgentTitlesComponent],
      providers: [
        {
          provide: AlgorithmRetrievalService,
          useValue: {
            numberOfGroup1Agents: 3,
            numberOfGroup2Agents: 3,
            currentAlgorithm: {
              id: 'smp-man-egs',
              name: 'Stable Marriage Problem',
              orientation: ['Man', 'Woman'],
              equalGroups: true,
            },
            pluralMap: new Map([
              ['Man', 'Men'],
              ['Woman', 'Women'],
            ]),
            getSide: jasmine.createSpy('getSide'),
          },
        },
      ],
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
