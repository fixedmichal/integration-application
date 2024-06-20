import { BudgetCategoryItem } from './budget-category-item.type';

export type BudgetCategory = {
  name: string;
  integrationId: number;
  id?: number;
  cost?: number;
  items?: BudgetCategoryItem[];
  isModified?: boolean;
  isNewEntry?: boolean;
};
