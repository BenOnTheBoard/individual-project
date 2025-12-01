import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { EditPreferencesDialogComponent } from './edit-preferences-dialog.component';
import { PlaybackService } from '../services/playback/playback.service';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
import { CanvasService } from '../services/canvas/canvas.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('EditPreferencesDialogComponent', () => {
  let component: EditPreferencesDialogComponent;
  let fixture: ComponentFixture<EditPreferencesDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        EditPreferencesDialogComponent,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        {
          provide: PlaybackService,
          useValue: {
            commandList: [
              {
                lineNumber: 0,
                freeAgents: [],
                matches: new Map(),
                stepVariables: {},
                group1CurrentPreferences: new Map<string, string[]>([
                  ["1", ["A", "B", "C"]],
                  ["2", ["B", "A", "C"]],
                  ["3", ["C", "A", "B"]],
                ]),
                group2CurrentPreferences: new Map<string, string[]>([
                  ["A", ["1", "2", "3"]],
                  ["B", ["2", "1", "3"]],
                  ["C", ["3", "1", "2"]],
                ]),
                currentlySelectedAgents: [],
                currentLines: [],
                algorithmSpecificData: {},
                relevantPreferences: [],
              }
            ],
            previousStepCounter: 0,
            setAlgorithm: jasmine.createSpy('setAlgorithm')
          }
        },
        {
          provide: AlgorithmRetrievalService,
          useValue: {
            numberOfGroup1Agents: 3,
            numberOfGroup2Agents: 3,
            currentAlgorithm: {
              id: "smp-man-egs",
              name: "Stable Marriage Problem",
              orientation: ["Man", "Woman"],
              equalGroups: true,
            },
            pluralMap: new Map([["Man", "Men"], ["Woman", "Women"],])
          }
        },
        {
          provide: CanvasService,
          useValue: {
            initialise: jasmine.createSpy('initialise')
          }
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: jasmine.createSpy('open')
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPreferencesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
