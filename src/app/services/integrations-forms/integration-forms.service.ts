import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, combineLatest, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IntegrationFormsService {
  private isBudgetPrimaryDetailsFormValid$$ = new ReplaySubject<boolean>(1);
  private isNameAndImageDataFormValid$$ = new ReplaySubject<boolean>(1);

  get areIntegrationFormsValid$(): Observable<boolean> {
    return combineLatest({
      isBudgetPrimaryDetailsFormValid: this.isBudgetPrimaryDetailsFormValid$$.asObservable(),
      isNameAndImageDataFormValid: this.isNameAndImageDataFormValid$$.asObservable(),
    }).pipe(
      map(
        ({ isBudgetPrimaryDetailsFormValid, isNameAndImageDataFormValid }) =>
          isBudgetPrimaryDetailsFormValid && isNameAndImageDataFormValid
      )
    );
  }

  sendIsBudgetPrimaryDetailsFormValid(isFormValid: boolean): void {
    this.isBudgetPrimaryDetailsFormValid$$.next(isFormValid);
  }

  sendIsNameAndImageDataFormValid(isFormValid: boolean): void {
    this.isNameAndImageDataFormValid$$.next(isFormValid);
  }

  cleanup(): void {
    this.isBudgetPrimaryDetailsFormValid$$.next(false);
  }
}
