import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPrimaryDetailsComponent } from './budget-primary-details-form.component';

describe('IntegrationBudgetPrimaryDetailsComponent', () => {
  let component: BudgetPrimaryDetailsComponent;
  let fixture: ComponentFixture<BudgetPrimaryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetPrimaryDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetPrimaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
