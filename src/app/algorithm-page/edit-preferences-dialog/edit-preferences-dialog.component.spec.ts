import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { EditPreferencesDialogComponent } from './edit-preferences-dialog.component';

describe('EditPreferencesDialogComponent', () => {
  let component: EditPreferencesDialogComponent;
  let fixture: ComponentFixture<EditPreferencesDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialog,
        MatDialogModule,
        MatDialogRef,
        EditPreferencesDialogComponent,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPreferencesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
