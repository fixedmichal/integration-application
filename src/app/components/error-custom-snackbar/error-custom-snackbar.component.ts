import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-error-custom-snackbar',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarActions, MatIcon],
  templateUrl: './error-custom-snackbar.component.html',
  styleUrl: './error-custom-snackbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorCustomSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public message: string) {}
  snackBarRef = inject(MatSnackBarRef);
}
