import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeContentComponent } from './home-content.component';

describe('HomeContentComponent', () => {
  let component: HomeContentComponent;
  let fixture: ComponentFixture<HomeContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, HomeContentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
