import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PseudocodeComponent } from './pseudocode.component';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';

describe('PseudocodeComponent', () => {
  let component: PseudocodeComponent;
  let fixture: ComponentFixture<PseudocodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PseudocodeComponent],
      providers: [
        {
          provide: AlgorithmRetrievalService,
          useValue: {
            currentAlgorithm: {
              id: 'smp-man-egs',
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PseudocodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
