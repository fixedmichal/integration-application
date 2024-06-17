import { BudgetCategoriesViewConfiguration } from 'src/types/view-configuration-types/budget-categories-view-configuration.type';

export const versionsBudgetCategoriesViewConfiguration: BudgetCategoriesViewConfiguration = {
  isAddButtonsColumnDisplayed: true,
  isRemoveButtonsColumnDisplayed: false,
  isAddCategoryButtonDisplayed: false,
  isTableHeightExtended: true,
  isTableExpandedRowWithPadding: false,
  areCategoryItemsRemoveButtonsDisplayed: true,
  tableColspan: 2,
} as const;
