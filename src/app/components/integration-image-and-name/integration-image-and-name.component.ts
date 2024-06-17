import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IntegrationFormsService } from '@services/integrations-forms/integration-forms.service';
import { Subject, distinctUntilChanged, filter, takeUntil, tap } from 'rxjs';
import { ExtendedIntegration } from 'src/types/extended-integration.type';

@Component({
  selector: 'app-integration-image-and-name',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatIconModule],
  templateUrl: './integration-image-and-name.component.html',
  styleUrl: './integration-image-and-name.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationImageAndNameComponent implements OnInit, OnDestroy {
  @Input({ required: true }) integration!: ExtendedIntegration;
  @Output() dataChanged = new EventEmitter<Pick<ExtendedIntegration, 'name' | 'picture'>>();

  protected form = new FormGroup({
    name: new FormControl<string>({ value: '', disabled: false }, [Validators.required]),
    imageUrl: new FormControl<string>({ value: '', disabled: false }, [Validators.required]),
  });

  private readonly integrationFormsService = inject(IntegrationFormsService);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.setupFormValues();

    this.integrationFormsService.sendIsNameAndImageDataFormValid(this.form.valid);

    this.form.valueChanges
      .pipe(
        distinctUntilChanged(),
        tap(() => {
          this.integrationFormsService.sendIsNameAndImageDataFormValid(this.form.valid);
        }),
        filter((value) => Boolean(value.name) && Boolean(value.imageUrl)),
        tap((value) => {
          const nameAndImageData = { name: value.name!, picture: value.imageUrl! };

          this.dataChanged.emit(nameAndImageData);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  setupFormValues(): void {
    this.form.controls.name.setValue(this.integration.name);
    this.form.controls.imageUrl.setValue(this.integration.picture);
    this.form.controls.imageUrl.markAsTouched();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
