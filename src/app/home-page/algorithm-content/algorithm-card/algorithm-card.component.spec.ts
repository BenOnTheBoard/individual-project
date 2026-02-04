import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AlgorithmCardComponent } from './algorithm-card.component';

describe('AlgorithmCardComponent', () => {
  let component: AlgorithmCardComponent;
  let fixture: ComponentFixture<AlgorithmCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AlgorithmCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgorithmCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('algorithm', {
      id: '',
      name: '',
      orientation: ['', ''],
      equalGroups: true,
      algorithm: '',
      service: null,
      description: '',
      helpTextMap: {},
      code: [],
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
