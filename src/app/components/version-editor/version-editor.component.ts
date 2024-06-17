import {
  primaryVersionActionsViewConfiguration,
  secondaryVersionActionsViewConfiguration,
} from './constants/version-actions-view-configs.constant';
import { AsyncPipe, NgFor } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, Input, inject, OnDestroy, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { BudgetCategoriesComponent } from '@components/budget-categories/budget-categories.component';
import { VersionsService } from '@services/versions/versions.service';
import { Subject, mergeMap, shareReplay, startWith, take, takeUntil, tap } from 'rxjs';
import { Version } from 'src/types';
import { VersionActionsComponent } from '@components/version-actions/version-actions.component';
import { versionsBudgetCategoriesViewConfiguration } from './constants/versions-budget-categories-view-config.constant';
import { Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { VersionsListComponent } from '../versions-list/versions-list.component';
import { ConvertToPercentage } from '../../pipes/convert-to-percentage.pipe';
import { MatDialog } from '@angular/material/dialog';
import { VersionNameDialogComponent } from '@components/duplicated-version-name-dialog/version-name-dialog.component';

@Component({
  selector: 'app-version-editor',
  standalone: true,
  templateUrl: './version-editor.component.html',
  styleUrl: './version-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BudgetCategoriesComponent,
    AsyncPipe,
    NgFor,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatDividerModule,
    VersionActionsComponent,
    MatProgressBarModule,
    VersionsListComponent,
    ConvertToPercentage,
  ],
})
export class VersionEditorComponent implements OnInit, OnDestroy {
  @Input({ required: true }) integrationId!: number;
  @ViewChild('versionsList') versionsListComponent: VersionsListComponent | undefined;

  protected readonly budgetCategoriesViewConfig = versionsBudgetCategoriesViewConfiguration;
  protected readonly primaryVersionActionsViewConfig = primaryVersionActionsViewConfiguration;
  protected readonly secondaryVersionActionsViewConfig = secondaryVersionActionsViewConfiguration;

  private readonly versionsService = inject(VersionsService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  protected integrationPrimaryVersion$ = this.versionsService.integrationPrimaryVersion$;
  protected integrationSecondaryVersion$ = this.versionsService.integrationSecondaryVersion$;
  protected allVersions$ = this.versionsService.allVersionsOfCurrentIntegration$.pipe(startWith([]));

  protected percentageOfPrimaryVersion$ = this.versionsService
    .getPercentageOfVersionBudgetFullfilled(this.integrationPrimaryVersion$)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  protected percentageOfSecondaryVersion$ = this.versionsService
    .getPercentageOfVersionBudgetFullfilled(this.integrationSecondaryVersion$)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private destroy$$ = new Subject<void>();

  ngOnInit(): void {
    this.versionsService.saveIntegrationId(this.integrationId);

    this.versionsService.emitPrimaryIntegrationVersion().pipe(takeUntil(this.destroy$$)).subscribe();
    this.versionsService.emitSecondaryIntegrationVersion().pipe(takeUntil(this.destroy$$)).subscribe();

    this.versionsService
      .getAllVersionsOfCurrentIntegration()
      .pipe(
        tap(() => this.versionsService.setSecondaryVersionStartingValue()),
        takeUntil(this.destroy$$)
      )
      .subscribe();
  }

  selectSecondaryVersion(version: Version): void {
    this.versionsService.setSecondaryVersion(version);
  }

  onDuplicateVersionClick(versionId: number): void {
    this.versionsService
      .duplicateVersion(versionId)
      .pipe(
        tap(() => this.versionsListComponent?.scrollToTheEnd()),
        takeUntil(this.destroy$$)
      )
      .subscribe();
  }

  onChangeVersionNameClick({ id, name }: { id: number; name: string }) {
    const dialogRef = this.dialog.open(VersionNameDialogComponent, {
      data: { name },
    });

    dialogRef
      .afterClosed()
      .pipe(
        mergeMap((versionName) => this.versionsService.patchVersion(id, { name: versionName })),
        mergeMap(() => this.versionsService.getAllVersionsOfCurrentIntegration()),
        takeUntil(this.destroy$$)
      )
      .subscribe();
  }

  onDeleteVersionClick(versionId: number): void {
    this.versionsService.deleteVersion(versionId).pipe(takeUntil(this.destroy$$)).subscribe();
  }

  onSetAsMainVersionClick(): void {
    this.versionsService.setVersionAsMain().pipe(takeUntil(this.destroy$$)).subscribe();
  }

  onPrimaryVersionEditClick(): void {
    this.router.navigate([`/update/${this.integrationId}`]);
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();

    this.versionsService.cleanup();
  }
}
