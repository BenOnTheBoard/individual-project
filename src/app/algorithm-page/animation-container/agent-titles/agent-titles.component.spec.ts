import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgentTitlesComponent } from './agent-titles.component';

describe('AgentTitlesComponent', () => {
  let component: AgentTitlesComponent;
  let fixture: ComponentFixture<AgentTitlesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentTitlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentTitlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
