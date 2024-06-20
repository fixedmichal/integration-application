import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateBudgetsPercentage',
  standalone: true,
})
export class CalculateBudgetsPercentagePipe implements PipeTransform {
  transform({ integrationBudget, categoryCost }: { integrationBudget: number; categoryCost: number }): string {
    categoryCost ??= 0;

    if (isNaN(categoryCost)) {
      return '0%';
    }

    const percentage = ((categoryCost / integrationBudget) * 100).toFixed(1);
    return `${percentage}%`;
  }
}
