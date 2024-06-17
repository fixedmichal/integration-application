import { CalculateBudgetsPercentagePipe } from './calculate-budgets-percentage.pipe';

describe('SumBudgetItemsCostsPipe', () => {
  it('create an instance', () => {
    const pipe = new CalculateBudgetsPercentagePipe();
    expect(pipe).toBeTruthy();
  });
});
