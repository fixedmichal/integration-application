import { IntegrationsComponentsCommunicationService } from '@services/integrations-components-communication/integrations-components-communication.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BudgetCategory, BudgetCategoryItem } from '../../../types';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { BudgetCategoryItemsComponent } from '../budget-category-items/budget-category-items.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CalculateBudgetsPercentagePipe } from '../../pipes/calculate-budgets-percentage.pipe';
import { MatButtonModule } from '@angular/material/button';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgClass } from '@angular/common';
import { AddNewCategoryItemComponent } from '../add-new-category-item/add-new-category-item.component';
import { CategoryItemsService } from '@services/category-items/category-items.service';
import { VersionsComponentsCommunicationService } from '@services/versions-components-communication/versions-components-communication.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { BudgetCategoriesViewConfiguration } from 'src/types/view-configuration-types/budget-categories-view-configuration.type';

@Component({
  selector: 'app-budget-categories-table',
  standalone: true,
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  templateUrl: './budget-categories-table.component.html',
  styleUrl: './budget-categories-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    BudgetCategoryItemsComponent,
    CalculateBudgetsPercentagePipe,
    ScrollingModule,
    NgClass,
    AddNewCategoryItemComponent,
  ],
})
export class BudgetCategoriesTableComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$$ = new Subject<void>();

  @Input({ required: true }) budgetCategories: BudgetCategory[] = [];
  @Input({ required: true }) integrationBudget: number = 0;
  @Input({ required: true }) isAddNewCategorySectionOpen = false;
  @Input({ required: true }) versionId!: number;
  // @Input({ required: true }) showAddButtonsColumn = false;
  // @Input({ required: true }) viewConfig.showRemoveButtonsColumn = false;
  // @Input() isHeightExtended = false;
  @Input({ required: true }) viewConfig!: BudgetCategoriesViewConfiguration;

  expandedRowCategoryId!: number | null;

  protected dataSource!: MatTableDataSource<BudgetCategory, MatPaginator>;
  protected columnsToDisplay!: string[];
  protected expandedElement!: BudgetCategory | null | undefined;

  private readonly integrationsComponentsCommunicationService = inject(IntegrationsComponentsCommunicationService);
  private readonly versionsComponentsCommunicationService = inject(VersionsComponentsCommunicationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly categoryItemsService = inject(CategoryItemsService);

  ngOnInit(): void {
    this.setupTableColumns();
    this.dataSource = new MatTableDataSource(this.budgetCategories);
    // TODO: possible refactor?
    this.versionsComponentsCommunicationService.expandCategoryRow$
      .pipe(
        tap((categoryItem) => {
          const category = this.budgetCategories.find((category) => category.id === categoryItem.categoryId);

          if (category && categoryItem.versionId === this.versionId) {
            this.expandedElement = category;
            this.cdr.markForCheck();
          }
        }),
        takeUntil(this.destroy$$)
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['budgetCategories']) {
      this.dataSource = new MatTableDataSource(this.budgetCategories);
    }
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }

  onDeleteCategoryClick(categoryIndex: number): void {
    this.integrationsComponentsCommunicationService.emitDeletedCategory(categoryIndex);
    this.dataSource = new MatTableDataSource(this.budgetCategories);
  }

  onAddedCategoryItem(categoryItem: BudgetCategoryItem): void {
    this.categoryItemsService.emitAddedCategoryItem(categoryItem);
  }

  showAddCategoryItemSection(categoryId: number): void {
    this.expandedRowCategoryId = categoryId;
  }

  closeAddCategoryItemSection(): void {
    this.expandedRowCategoryId = null;
  }

  setupTableColumns(): void {
    if (this.viewConfig.isAddButtonsColumnDisplayed && !this.viewConfig.isRemoveButtonsColumnDisplayed) {
      this.columnsToDisplay = ['kategoria', 'kwota', 'procent', 'add', 'expand'];
    } else if (!this.viewConfig.isAddButtonsColumnDisplayed && this.viewConfig.isRemoveButtonsColumnDisplayed) {
      this.columnsToDisplay = ['delete', 'kategoria', 'kwota', 'procent', 'expand'];
    } else {
      this.columnsToDisplay = ['delete', 'kategoria', 'kwota', 'procent', 'add', 'expand'];
    }
  }
}
