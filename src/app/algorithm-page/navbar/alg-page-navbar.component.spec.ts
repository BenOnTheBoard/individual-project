import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AlgPageNavbarComponent } from './alg-page-navbar.component';
import { mockAlgorithmRetrievalService } from 'src/app/mock-services/algorithm-retrieval.mock';

describe('Navbar', () => {
  let component: AlgPageNavbarComponent;
  let fixture: ComponentFixture<AlgPageNavbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AlgPageNavbarComponent],
      providers: [mockAlgorithmRetrievalService],
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
