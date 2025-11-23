import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FreeAgentsComponent } from './free-agents.component';

describe('FreeAgentsComponent', () => {
  let component: FreeAgentsComponent;
  let fixture: ComponentFixture<FreeAgentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeAgentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
