import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IconBannerComponent } from './icon-banner.component';

describe('IconBannerComponent', () => {
  let component: IconBannerComponent;
  let fixture: ComponentFixture<IconBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IconBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
