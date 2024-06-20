import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { OnlyNumericValuesDirective } from 'src/app/directives/only-numeric-values.directive';
import { BudgetCategoryItem } from 'src/types';

@Component({
  selector: 'app-add-new-category-item',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    OnlyNumericValuesDirective,
  ],
  templateUrl: './add-new-category-item.component.html',
  styleUrl: './add-new-category-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewCategoryItemComponent implements OnInit {
  @Input({ required: true }) categoryId!: number;
  @Input({ required: true }) versionId!: number;
  @Output() addedCategoryItem = new EventEmitter<BudgetCategoryItem>();

  @Output() close = new EventEmitter<void>();

  protected form = new FormGroup({
    name: new FormControl({ value: '', disabled: false }, [Validators.required]),
    cost: new FormControl({ value: 0, disabled: false }, [Validators.required]),
    isPerParticipant: new FormControl({ value: false, disabled: false }),
  });

  ngOnInit(): void {
    console.log(this.categoryId);
    console.log(this.versionId);
  }

  onAddClick(): void {
    const categoryItem = {
      name: this.form.controls.name.value!,
      cost: +this.form.controls.cost.value!,
      perParticipant: this.form.controls.isPerParticipant.value!,
      categoryId: this.categoryId!,
      versionId: this.versionId!,
    };

    console.log('🚀 ~ AddNewCategoryItemComponent ~ onAddClick ~ onAddClick:', categoryItem);

    this.addedCategoryItem.emit(categoryItem);
  }

  closeSection(): void {
    this.close.emit();
  }
}
