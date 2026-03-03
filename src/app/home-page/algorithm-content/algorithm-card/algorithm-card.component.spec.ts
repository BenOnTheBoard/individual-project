import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AlgorithmCardComponent } from './algorithm-card.component';
import { AlgorithmBuilder } from 'src/app/algorithm-retrieval/Algorithm';

describe('AlgorithmCardComponent', () => {
  let component: AlgorithmCardComponent;
  let fixture: ComponentFixture<AlgorithmCardComponent>;

  const mockAlgorithm: Algorithm = new AlgorithmBuilder()
    .id('smp-man-gs')
    .orientation(['Man', 'Woman'])
    .build();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AlgorithmCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgorithmCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('algorithm', mockAlgorithm);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
