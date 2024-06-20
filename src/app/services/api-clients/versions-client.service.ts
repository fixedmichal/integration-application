import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../../constants/api-base-url.constants';
import { Version } from '../../../types/version.type';

@Injectable({
  providedIn: 'root',
})
export class VersionsClientService {
  constructor(private http: HttpClient) {}

  getAllVersions() {
    return this.http.get<Version[]>(`${API_BASE_URL}/versions`);
  }

  createVersion(version: Version) {
    return this.http.post(`${API_BASE_URL}/versions`, version);
  }

  getVersionById(id: number) {
    return this.http.get<Version>(`${API_BASE_URL}/versions/${id}`);
  }

  patchVersion(id: number, version: Partial<Pick<Version, 'name' | 'isFinal'>>): Observable<Version> {
    return this.http.patch<Version>(`${API_BASE_URL}/versions/${id}`, version);
  }

  deleteVersion(id: number) {
    return this.http.delete(`${API_BASE_URL}/versions/${id}`);
  }

  duplicateGivenVersionById(id: number) {
    return this.http.post<Version>(`${API_BASE_URL}/versions/${id}/duplicate`, null);
  }
}
