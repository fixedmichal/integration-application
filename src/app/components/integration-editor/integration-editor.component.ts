import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { BudgetPrimaryDetailsComponent } from '../budget-primary-details-form/budget-primary-details-form.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { BudgetCategoriesComponent } from '../budget-categories/budget-categories.component';
import { IntegrationsService } from '../../services/integration/integrations.service';
import { Subject } from 'rxjs';
import { IntegrationImageAndNameComponent } from '../integration-image-and-name/integration-image-and-name.component';
import { ExtendedIntegration } from 'src/types/extended-integration.type';
import { integrationsBudgetCategoriesViewConfiguration } from './constants/integrations-budget-categories-view-configuration.constant';

@Component({
  selector: 'app-integration-editor',
  standalone: true,
  templateUrl: './integration-editor.component.html',
  styleUrl: './integration-editor.component.scss',
  imports: [
    BudgetPrimaryDetailsComponent,
    BudgetCategoriesComponent,
    NgIf,
    AsyncPipe,
    IntegrationImageAndNameComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationEditorComponent implements OnInit, OnDestroy {
  @Input() integrationId!: number;

  protected readonly budgetCategoriesViewConfig = integrationsBudgetCategoriesViewConfiguration;

  private readonly integrationService = inject(IntegrationsService);
  protected integration$ = this.integrationService.currentIntegration$;

  ngOnInit(): void {
    if (this.integrationId) {
      this.integrationService.loadIntegrationById(this.integrationId);
    } else {
      this.integrationService.loadEmptyIntegration();
    }

    const destroy$ = this.destroy$$.asObservable();

    this.integrationService.setupStreamForAddedNewBudgetCategory(destroy$);
    this.integrationService.setupStreamForUpdatedBudgetPrimaryDetails(destroy$);
    this.integrationService.setupStreamForDeletedBudgetCategory(destroy$);
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();

    this.integrationService.cleanup();
  }

  onNameAndImageDataChanged(nameAndImageData: Pick<ExtendedIntegration, 'name' | 'picture'>): void {
    this.integrationService.changeNameAndImageOfIntegration(nameAndImageData);
  }

  private destroy$$ = new Subject<void>();
}
