import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AlgorithmPageComponent } from './algorithm-page.component';
import { AlgorithmRetrievalService } from '../algorithm-retrieval/algorithm-retrieval.service';
import { CanvasService } from './services/canvas/canvas.service';
import { GsStableMarriageService } from '../algorithms/algorithm-services/smp-man-gs/gs-stable-marriage.service';
import { AlgorithmBuilder } from '../algorithm-retrieval/Algorithm';
import { AgentFactory } from '../algorithms/interfaces/Agents';
import { PlaybackService } from './services/playback/playback.service';

describe('AlgorithmPageComponent', () => {
  let component: AlgorithmPageComponent;
  let fixture: ComponentFixture<AlgorithmPageComponent>;
  const mockAgent = AgentFactory.createTiedHospital('hospitalA', 2);
  const mockStep = {
    freeAgents: [mockAgent],
    algorithmSpecificData: {
      markedAgents: [mockAgent],
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        AlgorithmPageComponent,
      ],
      providers: [
        {
          provide: PlaybackService,
          useValue: {
            commandList: [mockStep],
            algorithmData: {
              descriptions: [],
            },
            stepCounter: 0,
            getCurrentStep: jasmine
              .createSpy('getCurrentStep')
              .and.returnValue(mockStep),
            setAlgorithm: jasmine.createSpy('setAlgorithm'),
          },
        },
        {
          provide: AlgorithmRetrievalService,
          useValue: {
            currentAlgorithm: {
              id: 'smp-man-gs',
              orientation: ['Man', 'Woman'],
            },
            irregularPluralMap: new Map([
              ['Man', 'Men'],
              ['Woman', 'Women'],
            ]),
            mapOfAvailableAlgorithms: new Map(),
            getSide: jasmine.createSpy('getSide'),
            getAlgorithm: jasmine.createSpy('getAlgorithm'),
            mayBeUnstable: jasmine
              .createSpy('mayBeUnstable')
              .and.returnValue(true),
            marksAgents: jasmine.createSpy('marksAgents').and.returnValue(true),
          },
        },
        {
          provide: CanvasService,
          useValue: {
            initialise: jasmine.createSpy('initialise'),
            redrawCanvas: jasmine.createSpy('redrawCanvas'),
            setCanvas: jasmine.createSpy('setCanvas'),
          },
        },
        GsStableMarriageService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    const algorithmRetriever = TestBed.inject(AlgorithmRetrievalService) as any;
    const matchingService = TestBed.inject(GsStableMarriageService);
    const mockAlgorithm = new AlgorithmBuilder()
      .service(matchingService)
      .build();

    algorithmRetriever.mapOfAvailableAlgorithms.set(
      'smp-man-gs',
      mockAlgorithm,
    );
    algorithmRetriever.getAlgorithm.and.returnValue(mockAlgorithm);

    (window as any).anime = jasmine.createSpy('anime').and.callFake(() => ({}));
    (window as any).$ = (selector: any) => ({
      popover: jasmine.createSpy('popover').and.returnValue({
        show: jasmine.createSpy('show'),
        hide: jasmine.createSpy('hide'),
      }),
    });

    fixture = TestBed.createComponent(AlgorithmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
