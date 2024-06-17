import { VersionNameDialogComponent } from '../../components/duplicated-version-name-dialog/version-name-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { VersionsComponentsCommunicationService } from './../versions-components-communication/versions-components-communication.service';
import { Injectable } from '@angular/core';
import { CategoryItemsClientService } from '@services/api-clients/category-items-client.service';
import { IntegrationsClientService } from '@services/api-clients/integrations-client.service';
import { VersionsClientService } from '@services/api-clients/versions-client.service';
import { CategoryItemsService } from '@services/category-items/category-items.service';
import { NotificationService } from '@services/notification/notification.service';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  ReplaySubject,
  catchError,
  delay,
  filter,
  first,
  map,
  mergeMap,
  of,
  tap,
  withLatestFrom,
} from 'rxjs';
import { createIntegrationWithCategoryItemsAndCategoryCost } from 'src/app/utils/integration.utils';
import { BudgetCategoryItem, Version } from 'src/types';
import { ExtendedIntegration } from 'src/types/extended-integration.type';

@Injectable({
  providedIn: 'root',
})
export class VersionsService {
  private integrationId$$ = new ReplaySubject<number | null>(1);

  private integrationPrimaryVersion$$ = new BehaviorSubject<ExtendedIntegration | null | undefined>(undefined);
  private integrationSecondaryVersion$$ = new BehaviorSubject<ExtendedIntegration | null | undefined>(undefined);

  private secondaryVersion$$ = new BehaviorSubject<Version | null>(null);
  private allVersionsOfCurrentIntegration$$ = new BehaviorSubject<Version[] | null | undefined>(undefined);

  get integrationPrimaryVersion$() {
    return this.integrationPrimaryVersion$$
      .asObservable()
      .pipe(filter((currentIntegration) => currentIntegration !== null));
  }

  get integrationSecondaryVersion$() {
    return this.integrationSecondaryVersion$$.asObservable().pipe(filter((data) => data !== undefined));
  }

  get currentIntegrationName$() {
    return this.integrationPrimaryVersion$$.asObservable().pipe(map((integration) => integration?.name));
  }

  get secondaryVersion$() {
    return this.secondaryVersion$$.asObservable().pipe(filter((data) => data !== null));
  }

  get allVersionsOfCurrentIntegration$() {
    return this.allVersionsOfCurrentIntegration$$.asObservable().pipe(filter((data) => data !== null));
  }

  get integrationId$() {
    return this.integrationId$$.asObservable().pipe(filter((data) => data !== null));
  }

  constructor(
    private integrationsClientService: IntegrationsClientService,
    private categoryItemsClientService: CategoryItemsClientService,
    private versionsClientService: VersionsClientService,
    private categoryItemsService: CategoryItemsService,
    private versionsComponentsCommunicationService: VersionsComponentsCommunicationService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    this.setupAddCategoryItemStream();
    this.setupRemoveCategoryItemStream();
  }

  saveIntegrationId(id: number): void {
    if (id) {
      this.integrationId$$.next(id);
    } else {
      throw Error('Wrong integrationd ID!');
    }
  }

  emitPrimaryIntegrationVersion() {
    return this.getAndAssemblePrimaryIntegrationVersionWithCategoryItems().pipe(
      tap((extendedIntegration) => this.integrationPrimaryVersion$$.next(extendedIntegration))
    );
  }

  getAndAssemblePrimaryIntegrationVersionWithCategoryItems(): Observable<ExtendedIntegration> {
    return this.integrationId$.pipe(
      mergeMap((id) => this.integrationsClientService.getFullIntegrationById(id!)),
      // it is mandatory, because BACKEND doesn't do this job
      map((integration) => ({
        ...integration!,
        appliedVersion: integration.versions?.find((version) => !!version.isFinal),
      })),
      mergeMap((integration) =>
        this.getCategoryItemsOfVersion(integration.appliedVersion?.id!).pipe(
          map((categoryItems) => ({
            ...createIntegrationWithCategoryItemsAndCategoryCost(integration, categoryItems),
          }))
        )
      )
    );
  }

  setSecondaryVersion(version: Version) {
    if (version) {
      this.secondaryVersion$$.next(version);
    } else {
      throw Error('Invalid Version ID!');
    }
  }

  setSecondaryVersionStartingValue() {
    const firstOfAllVersions = this.allVersionsOfCurrentIntegration$$.value?.[0];

    if (firstOfAllVersions) {
      this.secondaryVersion$$.next(firstOfAllVersions);
    }
  }

  emitSecondaryIntegrationVersion() {
    return this.assembleSecondaryIntegrationVersionWithCategoryItems().pipe(
      tap((secondaryIntegrationVersion) => this.integrationSecondaryVersion$$.next(secondaryIntegrationVersion))
    );
  }

  assembleSecondaryIntegrationVersionWithCategoryItems(): Observable<ExtendedIntegration> {
    let secondaryVersion: Version;

    return this.secondaryVersion$.pipe(
      tap((version) => (secondaryVersion = version!)),
      withLatestFrom(this.integrationPrimaryVersion$$),
      map(([_, integration]) => ({ ...integration!, appliedVersion: secondaryVersion })),
      tap((integration) => console.log('integration in ASSEMBLE!', integration)),
      mergeMap((integration) =>
        this.getCategoryItemsOfVersion(secondaryVersion?.id!).pipe(
          map((categoryItems) => ({
            ...createIntegrationWithCategoryItemsAndCategoryCost(integration!, categoryItems),
            // categoryItems,
          }))
        )
      )
    );
  }

  postNewCategoryItem(categoryItem: BudgetCategoryItem) {
    return this.categoryItemsClientService.postCategoryItem(categoryItem).pipe(
      catchError(() => {
        this.notificationService.showError('Failed to add category item!');

        return EMPTY;
      })
    );
  }

  deleteCategoryItem(categoryItemId: number) {
    return this.categoryItemsClientService.deleteCategoryItem(categoryItemId).pipe(
      catchError(() => {
        this.notificationService.showError('Failed to delete category item!');

        return EMPTY;
      })
    );
  }

  patchVersion(versionId: number, version: Partial<Pick<Version, 'name' | 'isFinal'>>) {
    return this.versionsClientService.patchVersion(versionId, version);
  }

  duplicateVersion(versionId: number) {
    let newDuplicatedVersion: Version;

    return this.versionsClientService.duplicateGivenVersionById(versionId).pipe(
      tap((version) => (newDuplicatedVersion = version)),
      mergeMap(() => {
        const dialogRef = this.dialog.open(VersionNameDialogComponent, {
          data: { name: newDuplicatedVersion.name },
        });

        return dialogRef.afterClosed();
      }),
      mergeMap((versionName) => this.patchVersion(newDuplicatedVersion?.id!, { name: versionName })),
      tap((version) => (newDuplicatedVersion = version)),
      mergeMap(() => this.getAllVersionsOfCurrentIntegration()),
      tap(() => this.notificationService.showSuccess('Successfully duplicated version!')),
      delay(10),
      tap(() => {
        this.secondaryVersion$$.next(newDuplicatedVersion);
        this.versionsComponentsCommunicationService.emitVersionDuplicationNotInProgress(versionId);
      })
    );
  }

  deleteVersion(versionId: number) {
    return this.versionsClientService.deleteVersion(versionId).pipe(
      tap(() => this.integrationSecondaryVersion$$.next(null)),
      tap(() => this.secondaryVersion$$.next(null)),
      mergeMap(() => this.getAllVersionsOfCurrentIntegration()),
      tap(() => this.notificationService.showSuccess('Successfully deleted version!')),
      tap((allVersions) => {
        if (allVersions.length > 0) {
          this.secondaryVersion$$.next(allVersions[0]);
        }
      })
    );
  }

  setVersionAsMain() {
    return this.versionsClientService
      .patchVersion(this.integrationSecondaryVersion$$.value?.appliedVersion?.id!, { isFinal: true })
      .pipe(
        mergeMap(() =>
          this.versionsClientService.patchVersion(this.integrationPrimaryVersion$$.value?.appliedVersion?.id!, {
            isFinal: false,
          })
        ),
        mergeMap(() => this.emitPrimaryIntegrationVersion()),
        tap(() => this.integrationSecondaryVersion$$.next(null)),
        tap(() => this.notificationService.showSuccess('Successfully set version as main!'))
      );
  }

  // we subscribe to this stream once in constructor od this service
  setupAddCategoryItemStream(): void {
    let categoryItem: BudgetCategoryItem;

    this.categoryItemsService.addedCategoryItem$
      .pipe(
        tap((addedCategoryItem) => (categoryItem = addedCategoryItem)),
        mergeMap((categoryItem) => this.addOrRemoveCategoryItemToVersion(this.postNewCategoryItem(categoryItem))),
        delay(1),
        tap(() => this.versionsComponentsCommunicationService.emitExpandCategoryRow(categoryItem)),
        tap(() => this.notificationService.showSuccess('Successfully added category item!'))
      )
      .subscribe();
  }

  // we subscribe to this stream once in constructor od this service
  setupRemoveCategoryItemStream(): void {
    let categoryItem: BudgetCategoryItem;

    this.categoryItemsService.removedCategoryItem$
      .pipe(
        tap((removedCategoryItem) => (categoryItem = removedCategoryItem)),
        mergeMap((categoryItem) => this.addOrRemoveCategoryItemToVersion(this.deleteCategoryItem(categoryItem?.id!))),
        delay(1),
        tap(() => this.versionsComponentsCommunicationService.emitExpandCategoryRow(categoryItem)),
        tap(() => this.notificationService.showSuccess('Successfully deleted category item!'))
      )
      .subscribe();
  }

  // IS IT FINE? OR DOES IT VIOLATE SINGLE RESPONSIBILITY PRINCIPLE?
  addOrRemoveCategoryItemToVersion(addOrRemoveStream: Observable<BudgetCategoryItem>) {
    const integrationVersions = [
      {
        value: this.integrationPrimaryVersion$$.value,
        assemblingMethod: () => this.emitPrimaryIntegrationVersion(),
      },
      {
        value: this.integrationSecondaryVersion$$.value,
        assemblingMethod: () => this.emitSecondaryIntegrationVersion(),
      },
    ];

    return addOrRemoveStream.pipe(
      map((categoryItem) => {
        const integrationVersion = integrationVersions.find(
          (integrationVersion) => integrationVersion.value?.appliedVersion?.id === categoryItem.versionId
        );

        return integrationVersion ? integrationVersion.assemblingMethod : () => of();
      }),
      mergeMap((assemblindMethod) => assemblindMethod().pipe(first()))
    );
  }

  getAllVersionsOfCurrentIntegration() {
    return this.integrationPrimaryVersion$.pipe(
      mergeMap((currentIntegration) =>
        this.versionsClientService.getAllVersions().pipe(map((versions) => ({ currentIntegration, versions })))
      ),
      map(({ currentIntegration, versions }) =>
        versions.filter((version) => version.integrationId === currentIntegration?.id! && !version.isFinal)
      ),
      tap((versions) => this.allVersionsOfCurrentIntegration$$.next(versions))
    );
  }

  getCategoryItemsOfVersion(versionId: number) {
    return this.categoryItemsClientService
      .getAllCategoryItems()
      .pipe(map((categoryItems) => categoryItems.filter((categoryItem) => categoryItem.versionId === versionId)));
  }

  getPercentageOfVersionBudgetFullfilled(integrationVersion$: Observable<ExtendedIntegration | null | undefined>) {
    return integrationVersion$.pipe(
      filter((integrationVersion) => integrationVersion !== null && integrationVersion !== undefined),
      map((integrationVersion) => {
        const totalCost = integrationVersion?.categoryItems?.reduce((acc, item) => (acc = acc + item.cost), 0);

        return ((totalCost ?? 0) * 100) / integrationVersion?.budget!;
      })
    );
  }

  cleanup(): void {
    this.integrationPrimaryVersion$$.next(null);
    this.integrationSecondaryVersion$$.next(null);
    this.allVersionsOfCurrentIntegration$$.next(null);
    this.secondaryVersion$$.next(null);
    this.integrationId$$.next(null);
  }
}
