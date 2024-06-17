import { BudgetCategory } from '../../../types/budget-category.type';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../../constants/api-base-url.constants';

@Injectable({
  providedIn: 'root',
})
export class CategoriesClientService {
  constructor(private http: HttpClient) {}

  private readonly CATEGORIES_URL = `${API_BASE_URL}/categories`;

  getAllCategories() {
    return this.http.get<BudgetCategory[]>(this.CATEGORIES_URL);
  }

  postCategory(category: BudgetCategory) {
    return this.http.post(this.CATEGORIES_URL, category);
  }

  getCategoryById(id: number) {
    return this.http.get<BudgetCategory>(`${this.CATEGORIES_URL}/${id}`);
  }

  patchCategory(id: number, category: BudgetCategory) {
    return this.http.patch(`${this.CATEGORIES_URL}/${id}`, category);
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.CATEGORIES_URL}/${id}`);
  }
}
