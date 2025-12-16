import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AlgorithmPageComponent } from './algorithm-page.component';
import { AlgorithmRetrievalService } from '../algorithm-retrieval.service';
import { CanvasService } from './services/canvas/canvas.service';
import { AlgorithmAnimationService } from './animations/algorithm-animation.service';

describe('AlgorithmPageComponent', () => {
  let component: AlgorithmPageComponent;
  let fixture: ComponentFixture<AlgorithmPageComponent>;

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
          provide: AlgorithmAnimationService,
          useValue: {
            loadPage: jasmine.createSpy('loadPage'),
            goHome: jasmine.createSpy('goHome'),
            fadeCanvasOut: jasmine.createSpy('fadeCanvasOut'),
            fadeCanvasIn: jasmine.createSpy('fadeCanvasIn'),
            hideSidebar: jasmine.createSpy('hideSidebar'),
            hideMainContent: jasmine.createSpy('hideMainContent'),
            showMainContent: jasmine.createSpy('showMainContent'),
            showSidebar: jasmine.createSpy('showSidebar'),
            hideInfoSidebar: jasmine.createSpy('hideInfoSidebar'),
            showInfoSidebar: jasmine.createSpy('showInfoSidebar'),
          },
        },
        {
          provide: AlgorithmRetrievalService,
          useValue: {
            currentAlgorithm: {
              id: 'smp-man-gs',
              orientation: ['Man', 'Woman'],
            },
            pluralMap: new Map([
              ['Man', 'Men'],
              ['Woman', 'Women'],
            ]),
            mapOfAvailableAlgorithms: new Map([
              [
                'smp-man-gs',
                {
                  service: {
                    run: jasmine.createSpy('run').and.returnValue({
                      commands: [{}],
                    }),
                  },
                  helpTextMap: {},
                },
              ],
            ]),
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
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgorithmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
