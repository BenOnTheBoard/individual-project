import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlgPageNavbarComponent } from './alg-page-navbar.component';

describe('Navbar', () => {
  let component: AlgPageNavbarComponent;
  let fixture: ComponentFixture<AlgPageNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlgPageNavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlgPageNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
