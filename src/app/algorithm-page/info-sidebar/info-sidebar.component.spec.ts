import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

import { InfoSidebarComponent } from './info-sidebar.component';

import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';

describe('InfoSidebarComponent', () => {
  let component: InfoSidebarComponent;
  let fixture: ComponentFixture<InfoSidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        RouterTestingModule,
        FormsModule,
        InfoSidebarComponent,
      ],
      providers: [
        {
          provide: AlgorithmRetrievalService,
          useValue: {
            currentAlgorithm: {
              name: '',
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // can't access this.algorithmService.currentAlgorithm.name - saying .name is undefined within tests
  it('should create', () => {
    expect(component).toBeDefined();
  });
});
