import { ErrorCustomSnackbarComponent } from '@components/error-custom-snackbar/error-custom-snackbar.component';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showError(message: string) {
    this.snackBar.openFromComponent(ErrorCustomSnackbarComponent, {
      duration: 20000,
      data: message,
      verticalPosition: 'bottom',
    });
  }

  showSuccess(message: string) {
    this.snackBar.open(message, undefined, { duration: 5000, verticalPosition: 'bottom' });
  }
}
