import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AlgorithmPageComponent } from './algorithm-page.component';
import { AlgorithmRetrievalService } from '../algorithm-retrieval.service';
import { CanvasService } from './services/canvas/canvas.service';

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
                      commands: [{ freeAgents: [] }],
                    }),
                  },
                  helpTextMap: {},
                },
              ],
            ]),
            getSide: jasmine.createSpy('getSide'),
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
