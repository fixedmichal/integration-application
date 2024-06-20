import { NotificationService } from '@services/notification/notification.service';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { IntegrationsService } from '../../services/integration/integrations.service';
import { IntegrationEditorComponent } from '../../components/integration-editor/integration-editor.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { IntegrationPageFooterComponent } from '../../components/integration-page-footer/integration-page-footer.component';
import { tap } from 'rxjs';

@Component({
  selector: 'app-create-integration-page',
  standalone: true,
  templateUrl: './create-integration-page.component.html',
  styleUrl: './create-integration-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IntegrationEditorComponent, CommonModule, RouterLink, MatButtonModule, IntegrationPageFooterComponent],
})
export class CreateIntegrationPageComponent implements OnInit, OnDestroy {
  private readonly integrationService = inject(IntegrationsService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.integrationService.loadEmptyIntegration();
  }

  ngOnDestroy(): void {
    this.integrationService.cleanup();
  }

  onCreateClick(): void {
    this.integrationService
      .createIntegration()
      .pipe(
        tap((integration) => {
          this.notificationService.showSuccess('Successfully created integration!');
          this.router.navigate([`/configure/${integration.id}`]);
        })
      )
      .subscribe();
  }
}
