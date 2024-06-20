import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { IntegrationTileComponent } from '../integration-tile/integration-tile.component';
import { NgForOf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BudgetCategoryItem } from '../../../types';
import { CategoryItemsService } from '@services/category-items/category-items.service';
import { BudgetCategoryItemComponent } from '../budget-category-item/budget-category-item.component';

@Component({
  selector: 'app-budget-category-items',
  standalone: true,
  templateUrl: './budget-category-items.component.html',
  styleUrl: './budget-category-items.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IntegrationTileComponent, NgForOf, MatIconModule, BudgetCategoryItemComponent],
})
export class BudgetCategoryItemsComponent {
  @Input() categoryItems: BudgetCategoryItem[] | null = [];
  @Input({ required: true }) areRemoveButtonsDisplayed!: boolean;

  deleteButtonClicked = false;

  private readonly categoryItemsService = inject(CategoryItemsService);

  onDeleteButtonClick(categoryItem: BudgetCategoryItem) {
    this.categoryItemsService.emitRemovedCategoryItem(categoryItem);
  }
}
