import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

import { BudgetCategory } from '../../../types/budget-category.type';
import { BudgetCategoriesTableComponent } from '../budget-categories-table/budget-categories-table.component';
import { IntegrationsComponentsCommunicationService } from '../../services/integrations-components-communication/integrations-components-communication.service';
import { ExtendedIntegration } from '../../../types/extended-integration.type';
import { AddNewCategoryComponent } from '../add-new-category/add-new-category.component';
import { BudgetCategoriesViewConfiguration } from 'src/types/view-configuration-types/budget-categories-view-configuration.type';

@Component({
  selector: 'app-budget-categories',
  standalone: true,
  templateUrl: './budget-categories.component.html',
  styleUrl: './budget-categories.component.scss',
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    NgFor,
    AsyncPipe,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule,
    BudgetCategoriesTableComponent,
    AddNewCategoryComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetCategoriesComponent implements AfterViewInit {
  @ViewChild('comp', { static: false }) comp!: ElementRef;

  @Input({ required: true }) integration!: ExtendedIntegration;

  @Input({ required: true }) viewConfig!: BudgetCategoriesViewConfiguration;
  isAddNewCategorySectionOpen = false;

  get lastBudgetCategory(): BudgetCategory {
    return this.integration.categories[this.integration.categories.length - 1];
  }

  get selectedVersionId(): number {
    return this.integration.appliedVersion?.id!;
  }

  private readonly componentsCommunicationService = inject(IntegrationsComponentsCommunicationService);
  private readonly elRef = inject(ElementRef);

  ngAfterViewInit(): void {
    console.log('width:', this.elRef.nativeElement.offsetWidth);
  }

  openAddNewCategorySection() {
    this.toggleIsAddingNewCategorySectionOpen();
  }

  addNewCategory(newBudgetCategory: BudgetCategory) {
    this.componentsCommunicationService.emitAddBudgetCategory(newBudgetCategory);
    this.toggleIsAddingNewCategorySectionOpen();
  }

  closeAddNewCategorySection(): void {
    this.toggleIsAddingNewCategorySectionOpen();
  }

  private toggleIsAddingNewCategorySectionOpen(): void {
    this.isAddNewCategorySectionOpen = !this.isAddNewCategorySectionOpen;
  }
}
