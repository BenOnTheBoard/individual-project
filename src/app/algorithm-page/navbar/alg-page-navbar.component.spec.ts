import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AlgPageNavbarComponent } from './alg-page-navbar.component';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval/algorithm-retrieval.service';

describe('Navbar', () => {
  let component: AlgPageNavbarComponent;
  let fixture: ComponentFixture<AlgPageNavbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AlgPageNavbarComponent],
      providers: [
        {
          provide: AlgorithmRetrievalService,
          useValue: {
            currentAlgorithm: {
              name: 'Stable Marriage Problem',
              algorithm: 'Gale-Shapley Algorithm',
            },
            getSide: jasmine
              .createSpy('getSide')
              .and.callFake((proposing: boolean, plural: boolean) => {
                'man';
              }),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgPageNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
