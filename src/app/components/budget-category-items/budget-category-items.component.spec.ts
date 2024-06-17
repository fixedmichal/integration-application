import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetCategoryItemsComponent } from './budget-category-items.component';

describe('IntegrationCategoryItemsComponent', () => {
  let component: BudgetCategoryItemsComponent;
  let fixture: ComponentFixture<BudgetCategoryItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetCategoryItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetCategoryItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
