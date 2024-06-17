import { BudgetCategory } from './budget-category.type';
import { BudgetCategoryItem } from './budget-category-item.type';
import { Version } from './version.type';

export type ExtendedIntegration = {
  budget: number;
  dateEnd?: string;
  dateStart?: string;
  name: string;
  participants: number;
  picture: string;
  categories: BudgetCategory[];
  id?: number;
  categoryItems?: BudgetCategoryItem[];
  versions?: Version[];
  appliedVersion?: Version;
  mainVersionName?: string;
};
