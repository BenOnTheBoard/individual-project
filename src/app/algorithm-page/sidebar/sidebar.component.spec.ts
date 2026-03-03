import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar.component';
import { CommonModule } from '@angular/common';
import { AlgDescriptionComponent } from './alg-description/alg-description.component';
import { FreeAgentsComponent } from './free-agents/free-agents.component';
import { PseudocodeComponent } from './pseudocode/pseudocode.component';
import { ExecutionLogComponent } from './execution-log/execution-log.component';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval/algorithm-retrieval.service';
import { mockPlaybackService } from '../services/playback/playback.mock';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SidebarComponent,
        CommonModule,
        MatDialogModule,
        RouterTestingModule,
        AlgDescriptionComponent,
        FreeAgentsComponent,
        PseudocodeComponent,
        ExecutionLogComponent,
      ],
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
            marksAgents: jasmine.createSpy('marksAgents').and.returnValue(true),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
