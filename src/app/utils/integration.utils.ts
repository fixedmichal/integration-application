import { BudgetCategoryItem, BudgetCategory } from '../../types';
import { ExtendedIntegration } from '../../types/extended-integration.type';

export function fillBudgetCategoriesWithItsItems(
  integration: ExtendedIntegration,
  budgetCategoryItems: BudgetCategoryItem[]
): BudgetCategory[] {
  return integration.categories.map((category) => ({
    ...category,
    items: budgetCategoryItems.filter((categoryItem) => categoryItem.categoryId === category.id),
  }));
}

export function extendBudgetCategoriesWithAdditionalData(budgetCategories: BudgetCategory[]): BudgetCategory[] {
  return budgetCategories.map((category) => {
    return {
      ...category,
      cost: category.items?.reduce((acc, curr) => acc + curr.cost, 0) ?? 0,
      isModified: false,
      isNewEntry: false,
    };
  });
}

export function createIntegrationWithCategoryItemsAndCategoryCost(
  integration: ExtendedIntegration,
  budgetCategoryItems: BudgetCategoryItem[]
): ExtendedIntegration {
  const budgetCategoryItemsFiltered = budgetCategoryItems.filter(
    (categoryItem) => categoryItem.versionId === integration?.appliedVersion?.id
  );

  const budgetCategoriesWithItsCategoryItemsAndCostSummed = extendBudgetCategoriesWithAdditionalData(
    fillBudgetCategoriesWithItsItems(integration, budgetCategoryItemsFiltered)
  );

  return {
    ...integration,
    categories: budgetCategoriesWithItsCategoryItemsAndCostSummed,
  };
}
