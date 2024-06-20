import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionNameDialogComponent } from './version-name-dialog.component';

describe('VersionNameDialogComponent', () => {
  let component: VersionNameDialogComponent;
  let fixture: ComponentFixture<VersionNameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionNameDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VersionNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
