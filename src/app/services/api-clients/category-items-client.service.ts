import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../constants/api-base-url.constants';
import { BudgetCategoryItem } from '../../../types';

@Injectable({
  providedIn: 'root',
})
export class CategoryItemsClientService {
  private apiUrl = API_BASE_URL + '/category-items';

  constructor(private http: HttpClient) {}

  getAllCategoryItems(): Observable<BudgetCategoryItem[]> {
    return this.http.get<BudgetCategoryItem[]>(this.apiUrl);
  }

  getCategoryItemById(categoryItemId: number): Observable<BudgetCategoryItem> {
    const url = `${this.apiUrl}/${categoryItemId}`;

    return this.http.get<BudgetCategoryItem>(url);
  }

  postCategoryItem(categoryItem: BudgetCategoryItem): Observable<BudgetCategoryItem> {
    return this.http.post<BudgetCategoryItem>(this.apiUrl, categoryItem);
  }

  updateCategoryItem(categoryItemId: number, categoryItemData: BudgetCategoryItem): Observable<any> {
    const url = `${this.apiUrl}/${categoryItemId}`;

    return this.http.patch<any>(url, categoryItemData);
  }

  deleteCategoryItem(categoryItemId: number): Observable<BudgetCategoryItem> {
    const url = `${this.apiUrl}/${categoryItemId}`;

    return this.http.delete<BudgetCategoryItem>(url);
  }
}
