import { Subject } from 'rxjs';
import { BudgetCategoryItem } from './../../../types/budget-category-item.type';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryItemsService {
  private addedCategoryItem$$ = new Subject<BudgetCategoryItem>();
  private removedCategoryItem$$ = new Subject<BudgetCategoryItem>();

  constructor() {}

  get addedCategoryItem$() {
    return this.addedCategoryItem$$.asObservable();
  }

  get removedCategoryItem$() {
    return this.removedCategoryItem$$.asObservable();
  }

  emitAddedCategoryItem(categoryItem: BudgetCategoryItem): void {
    this.addedCategoryItem$$.next(categoryItem);
  }

  emitRemovedCategoryItem(categoryItem: BudgetCategoryItem): void {
    this.removedCategoryItem$$.next(categoryItem);
  }
}
