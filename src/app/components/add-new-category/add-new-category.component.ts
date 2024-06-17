import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CalculateBudgetsPercentagePipe } from '../../pipes/calculate-budgets-percentage.pipe';
import { OnlyNumericValuesDirective } from '../../directives/only-numeric-values.directive';
import { BudgetCategory } from '../../../types';

@Component({
  selector: 'app-add-new-category',
  standalone: true,
  templateUrl: './add-new-category.component.html',
  styleUrl: './add-new-category.component.scss',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    CalculateBudgetsPercentagePipe,
    OnlyNumericValuesDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewCategoryComponent {
  @Input() lastBudgetCategory!: BudgetCategory;
  @Input() integrationBudget: number = 0;
  @Input() integrationId!: number;

  @Output() addNewCategory = new EventEmitter<BudgetCategory>();
  @Output() close = new EventEmitter<void>();

  protected form = new FormGroup({
    name: new FormControl({ value: '', disabled: false }, [Validators.required]),
    cost: new FormControl({ value: 0, disabled: false }, [Validators.required]),
  });

  onAddClick(): void {
    const newCategory: BudgetCategory = {
      name: this.form.get('name')?.value!,
      cost: Number(this.form.get('cost')?.value!),
      integrationId: this.integrationId,
      items: [],
      isNewEntry: true,
    };

    this.addNewCategory.emit(newCategory);
  }

  closeSection(): void {
    this.close.emit();
  }
}
