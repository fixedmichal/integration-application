import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EMPTY, Subject, catchError, filter, map, mergeMap, takeUntil, tap } from 'rxjs';
import { IntegrationEditorComponent } from '../../components/integration-editor/integration-editor.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { IntegrationsService } from '../../services/integration/integrations.service';
import { BudgetCategoryItemsComponent } from '../../components/budget-category-items/budget-category-items.component';
import { MatButton } from '@angular/material/button';
import { IntegrationPageFooterComponent } from '../../components/integration-page-footer/integration-page-footer.component';
import { NotificationService } from '@services/notification/notification.service';

@Component({
  selector: 'app-update-integration-page',
  standalone: true,
  templateUrl: './update-integration-page.component.html',
  styleUrl: './update-integration-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IntegrationEditorComponent,
    AsyncPipe,
    CommonModule,
    BudgetCategoryItemsComponent,
    MatButton,
    RouterLink,
    IntegrationPageFooterComponent,
  ],
})
export class UpdateIntegrationPageComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private integrationService: IntegrationsService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  protected integrationId$ = this.activatedRoute.params.pipe(
    map((activatedRoute) => activatedRoute['id'] as number),
    filter((id) => Boolean(id)),
    takeUntil(this.destroy$)
  );

  onUpdateClick() {
    this.integrationService
      .editIntegration()
      .pipe(
        mergeMap(() => this.integrationId$),
        tap((integrationId) => {
          this.notificationService.showSuccess('Successfully saved changes!');
          this.router.navigate([`/configure/${integrationId}`]);
        }),
        catchError(() => {
          this.notificationService.showError('Failed to save changes!');

          return EMPTY;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.integrationService.cleanup();
  }
}
