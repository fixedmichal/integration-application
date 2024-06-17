import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IntegrationTileComponent } from '../../components/integration-tile/integration-tile.component';
import { NgFor } from '@angular/common';
import { Integration } from '../../../types';
import { Subject, takeUntil, tap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { IntegrationsService } from '../../services/integration/integrations.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-integration-list-page',
  standalone: true,
  imports: [IntegrationTileComponent, NgFor, RouterLink, MatIconModule],
  templateUrl: './integration-list-page.component.html',
  styleUrl: './integration-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationListPageComponent implements OnInit, OnDestroy {
  integrations?: Integration[];
  private readonly integrationService = inject(IntegrationsService);
  private readonly cdr = inject(ChangeDetectorRef);

  private onDestroy$ = new Subject<void>();

  ngOnInit(): void {
    this.integrationService
      .getAllIntegrations()
      .pipe(
        tap((integrations) => {
          this.integrations = integrations;
          this.cdr.markForCheck();
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
