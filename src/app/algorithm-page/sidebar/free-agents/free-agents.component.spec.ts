import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FreeAgentsComponent } from './free-agents.component';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval/algorithm-retrieval.service';
import { mockPlaybackService } from 'src/app/mock-services/playback.mock';

describe('FreeAgentsComponent', () => {
  let component: FreeAgentsComponent;
  let fixture: ComponentFixture<FreeAgentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FreeAgentsComponent],
      providers: [
        mockPlaybackService,
        {
          provide: AlgorithmRetrievalService,
          useValue: {
            currentAlgorithm: {
              orientation: ['Man', 'Woman'],
            },
            irregularPluralMap: new Map([
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
    fixture = TestBed.createComponent(FreeAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
