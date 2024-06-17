import { TestBed } from '@angular/core/testing';

import { CategoriesClientService } from './categories-client.service';

describe('CategoriesClientService', () => {
  let service: CategoriesClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
