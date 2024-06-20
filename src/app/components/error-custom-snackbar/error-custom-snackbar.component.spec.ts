import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorCustomSnackbarComponent } from './error-custom-snackbar.component';

describe('ErrorCustomSnackbarComponent', () => {
  let component: ErrorCustomSnackbarComponent;
  let fixture: ComponentFixture<ErrorCustomSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorCustomSnackbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErrorCustomSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
