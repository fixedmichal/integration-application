import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BudgetCategoryItem } from 'src/types';

@Injectable({
  providedIn: 'root',
})
export class VersionsComponentsCommunicationService {
  private expandCategoryRow$$ = new Subject<BudgetCategoryItem>();
  private versionDuplicationNotInProgress$$ = new Subject<number | null>();

  get expandCategoryRow$() {
    return this.expandCategoryRow$$.asObservable();
  }

  get versionDuplicationNotInProgress$() {
    return this.versionDuplicationNotInProgress$$.asObservable();
  }

  emitExpandCategoryRow(categoryItem: BudgetCategoryItem): void {
    this.expandCategoryRow$$.next(categoryItem);
  }

  emitVersionDuplicationNotInProgress(versionId: number): void {
    this.versionDuplicationNotInProgress$$.next(versionId);
  }
}
