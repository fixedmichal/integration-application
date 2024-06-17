import { Integration } from '../../../types/integration.type';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../../constants/api-base-url.constants';
import { ExtendedIntegration } from '../../../types/extended-integration.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IntegrationsClientService {
  constructor(private http: HttpClient) {}

  getAllIntegrations() {
    return this.http.get<Integration[]>(`${API_BASE_URL}/integrations`);
  }

  postIntegration(integration: Integration): Observable<Integration> {
    return this.http.post<Integration>(`${API_BASE_URL}/integrations`, integration);
  }

  getIntegrationById(id: number) {
    return this.http.get<Integration>(`${API_BASE_URL}/integrations/${id}`);
  }

  patchIntegration(id: number, integration: Partial<Integration>) {
    return this.http.patch(`${API_BASE_URL}/integrations/${id}`, integration);
  }

  deleteIntegration(id: number) {
    return this.http.delete(`${API_BASE_URL}/integrations/${id}`);
  }

  getFullIntegrationById(id: number) {
    return this.http.get<ExtendedIntegration>(`${API_BASE_URL}/integrations/${id}/full`);
  }
}
