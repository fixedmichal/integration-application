import { ExtendedIntegration } from '../../../types/extended-integration.type';
import { Observable, Subject } from 'rxjs';
import { BudgetCategory } from '../../../types';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IntegrationsComponentsCommunicationService {
  private addedCategory$$ = new Subject<BudgetCategory>();
  private budgetPrimaryDetailsChanged$$ = new Subject<Partial<ExtendedIntegration>>();
  private deletedCategory$$ = new Subject<number>();

  get addedCategory$(): Observable<BudgetCategory> {
    return this.addedCategory$$.asObservable();
  }

  get budgetPrimaryDetailsChanged$() {
    return this.budgetPrimaryDetailsChanged$$.asObservable();
  }

  get deletedCategory$() {
    return this.deletedCategory$$.asObservable();
  }

  emitAddBudgetCategory(newBudgetCategory: BudgetCategory): void {
    this.addedCategory$$.next(newBudgetCategory);
  }

  emitBudgetPrimaryDetailsChanged(budgetPrimaryDetails: Partial<ExtendedIntegration>): void {
    this.budgetPrimaryDetailsChanged$$.next(budgetPrimaryDetails);
  }

  emitDeletedCategory(categoryIndex: number): void {
    this.deletedCategory$$.next(categoryIndex);
  }
}
