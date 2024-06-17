import { BudgetCategoriesViewConfiguration } from 'src/types/view-configuration-types/budget-categories-view-configuration.type';

export const integrationsBudgetCategoriesViewConfiguration: BudgetCategoriesViewConfiguration = {
  isAddButtonsColumnDisplayed: false,
  isRemoveButtonsColumnDisplayed: true,
  isAddCategoryButtonDisplayed: true,
  isTableHeightExtended: false,
  isTableExpandedRowWithPadding: true,
  areCategoryItemsRemoveButtonsDisplayed: false,
  tableColspan: 3,
} as const;
