import { TestBed } from '@angular/core/testing';

import { CategoryItemsClientService } from './category-items-client.service';

describe('CategoryItemsApiClientService', () => {
  let service: CategoryItemsClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryItemsClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
