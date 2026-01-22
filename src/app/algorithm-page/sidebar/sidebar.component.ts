import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
import { UtilsService } from 'src/app/utils/utils.service';
import { AlgorithmAnimationService } from '../animations/algorithm-animation.service';
import { CanvasService } from '../services/canvas/canvas.service';
import { PlaybackService } from '../services/playback/playback.service';
import { AlgDescriptionComponent } from './alg-description/alg-description.component';
import { PseudocodeComponent } from './pseudocode/pseudocode.component';
import { FreeAgentsComponent } from './free-agents/free-agents.component';
import { ExecutionLogComponent } from './execution-log/execution-log.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [
    ExecutionLogComponent,
    FreeAgentsComponent,
    PseudocodeComponent,
    AlgDescriptionComponent,
    NgClass,
  ],
})
export class SidebarComponent implements OnInit {
  @Input() showCode: boolean;
  @Input() tutorialStep: number;

  constructor(
    public playback: PlaybackService, // injecting the playback service
    public algorithmService: AlgorithmRetrievalService, // injecting the algorithm service
    public drawService: CanvasService, // injecting the canvas service
    public animation: AlgorithmAnimationService,
    public utils: UtilsService,
    public dialog: MatDialog, // injecting the dialog component
    public router: Router, // injecting the router service (for programmatic route navigation)
  ) {}

  ngOnInit(): void {}
}
