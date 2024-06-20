import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BudgetCategoryItem } from 'src/types';

@Component({
  selector: 'app-budget-category-item',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './budget-category-item.component.html',
  styleUrl: './budget-category-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetCategoryItemComponent {
  @Input({ required: true }) categoryItem!: BudgetCategoryItem;
  @Input({ required: true }) areRemoveButtonsDisplayed!: boolean;
  @Output() deleteCategoryItem = new EventEmitter<BudgetCategoryItem>();

  deleteButtonClicked: boolean | null = null;

  onDeleteButtonClick(categoryItem: BudgetCategoryItem) {
    if (this.deleteButtonClicked === null) {
      this.deleteButtonClicked = true;
    } else if (this.deleteButtonClicked === true || this.deleteButtonClicked === false) {
      this.deleteCategoryItem.emit(categoryItem);
      this.deleteButtonClicked = false;
    }
  }
}
