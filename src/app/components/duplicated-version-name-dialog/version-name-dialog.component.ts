import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { VersionNameDialogData } from './models/version-name-dialog-data.interface';

@Component({
  selector: 'app-duplicated-version-name-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './version-name-dialog.component.html',
  styleUrl: './version-name-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionNameDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<VersionNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: VersionNameDialogData
  ) {}

  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close(this.dialogData.name);
  }
}
