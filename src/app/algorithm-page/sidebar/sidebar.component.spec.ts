import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar.component';
import { CommonModule } from '@angular/common';
import { AlgDescriptionComponent } from './alg-description/alg-description.component';
import { FreeAgentsComponent } from './free-agents/free-agents.component';
import { PseudocodeComponent } from './pseudocode/pseudocode.component';
import { ExecutionLogComponent } from './execution-log/execution-log.component';
import { mockPlaybackService } from 'src/app/mock-services/playback.mock';
import { mockAlgorithmRetrievalService } from 'src/app/mock-services/algorithm-retrieval.mock';

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
      providers: [mockPlaybackService, mockAlgorithmRetrievalService],
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
