import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PseudocodeComponent } from './pseudocode.component';
import { mockAlgorithmRetrievalService } from 'src/app/mock-services/algorithm-retrieval.mock';

describe('PseudocodeComponent', () => {
  let component: PseudocodeComponent;
  let fixture: ComponentFixture<PseudocodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PseudocodeComponent],
      providers: [mockAlgorithmRetrievalService],
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
