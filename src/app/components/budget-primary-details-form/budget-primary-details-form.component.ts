import { OnlyNumericValuesDirective } from './../../directives/only-numeric-values.directive';
import { ExtendedIntegration } from '../../../types/extended-integration.type';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subject, distinctUntilChanged, filter, startWith, takeUntil, tap } from 'rxjs';
import { IntegrationFormsService } from '@services/integrations-forms/integration-forms.service';
import { IntegrationsComponentsCommunicationService } from '@services/integrations-components-communication/integrations-components-communication.service';

@Component({
  selector: 'app-budget-primary-details-form',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    OnlyNumericValuesDirective,
  ],
  templateUrl: './budget-primary-details-form.component.html',
  styleUrl: './budget-primary-details-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetPrimaryDetailsComponent implements OnInit, OnDestroy {
  @Input({ required: true }) integration!: ExtendedIntegration;

  private readonly componentsCommunicationService = inject(IntegrationsComponentsCommunicationService);
  private readonly integrationFormsService = inject(IntegrationFormsService);

  protected form = new FormGroup({
    mainVersionName: new FormControl<string>(''),
    budget: new FormControl<number>(0),
    participants: new FormControl<number>(0),
  });

  ngOnInit(): void {
    this.setFormValues();
    this.integrationFormsService.sendIsBudgetPrimaryDetailsFormValid(this.form.valid);

    this.form.valueChanges
      .pipe(
        startWith(this.form.value),
        distinctUntilChanged(),
        tap(() => {
          this.integrationFormsService.sendIsBudgetPrimaryDetailsFormValid(this.form.valid);
        }),
        // debounceTime(500),
        filter(
          (value) =>
            Boolean(value.budget) && value.budget! > 0 && Boolean(value.mainVersionName) && value.participants! > 0
        ),
        tap((value) => {
          const budgetPrimaryDetails = {
            budget: value.budget!,
            participants: value.participants!,
            mainVersionName: value.mainVersionName!,
          };

          this.componentsCommunicationService.emitBudgetPrimaryDetailsChanged(budgetPrimaryDetails);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    //TODO: validations and errors
  }

  setFormValues(): void {
    this.form.controls.mainVersionName.setValue(
      this.integration.versions?.find((version) => version.isFinal)?.name ?? 'Wersja pierwsza'
    );
    this.form.controls.budget.setValue(this.integration.budget);
    this.form.controls.participants.setValue(this.integration.participants);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private destroy$ = new Subject<void>();
}
