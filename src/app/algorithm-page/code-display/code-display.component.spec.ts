import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CodeDisplayComponent } from './code-display.component';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';

describe('CodeDisplayComponent', () => {
  let component: CodeDisplayComponent;
  let fixture: ComponentFixture<CodeDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CodeDisplayComponent],
      providers: [
        {
          provide: AlgorithmRetrievalService,
          useValue: {
            currentAlgorithm: {
              id: 'smp-man-egs',
              name: 'Stable Marriage Problem',
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
