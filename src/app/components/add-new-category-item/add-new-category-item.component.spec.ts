import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCategoryItemComponent } from './add-new-category-item.component';

describe('AddNewCategoryItemComponent', () => {
  let component: AddNewCategoryItemComponent;
  let fixture: ComponentFixture<AddNewCategoryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewCategoryItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewCategoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
