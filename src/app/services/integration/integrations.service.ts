import { VersionsClientService } from '../api-clients/versions-client.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, forkJoin, map, mergeMap, of, takeUntil, tap } from 'rxjs';
import { IntegrationsClientService } from '../api-clients/integrations-client.service';
import { CategoryItemsClientService } from '../api-clients/category-items-client.service';
import { ExtendedIntegration } from '../../../types/extended-integration.type';
import { IntegrationsComponentsCommunicationService } from '../integrations-components-communication/integrations-components-communication.service';
import { createIntegrationWithCategoryItemsAndCategoryCost } from '../../utils/integration.utils';
import { CategoriesClientService } from '@services/api-clients/categories-client.service';
import { BudgetCategory, Integration, Version } from 'src/types';

@Injectable({
  providedIn: 'root',
})
export class IntegrationsService {
  private currentIntegration$$ = new BehaviorSubject<ExtendedIntegration | null>(null);
  private categoriesToDelete$$ = new BehaviorSubject<BudgetCategory[]>([]);

  constructor(
    private integrationsClientService: IntegrationsClientService,
    private categoryItemsClientService: CategoryItemsClientService,
    private categoriesService: CategoriesClientService,
    private versionsClientService: VersionsClientService,
    private componentsCommunicationService: IntegrationsComponentsCommunicationService
  ) {}

  get currentIntegration$() {
    return this.currentIntegration$$.asObservable();
  }

  getAllIntegrations() {
    return this.integrationsClientService.getAllIntegrations();
  }

  loadIntegrationById(id: number): void {
    this.integrationsClientService
      .getFullIntegrationById(id)
      .pipe(
        map((integration) => ({
          ...integration!,
          appliedVersion: integration.versions?.find((version) => !!version.isFinal),
        })),
        // it is mandatory, because BACKEND doesn't do this job
        mergeMap((integration) =>
          this.categoryItemsClientService.getAllCategoryItems().pipe(
            tap((budgetCategoryItems) => {
              this.currentIntegration$$.next(
                createIntegrationWithCategoryItemsAndCategoryCost(integration, budgetCategoryItems)
              );
            })
          )
        )
      )
      .subscribe();
  }

  loadEmptyIntegration() {
    this.currentIntegration$$.next({
      name: 'Integracja',
      budget: 50000,
      participants: 40,
      picture:
        'https://images.pexels.com/photos/12221953/pexels-photo-12221953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      dateStart: '2024-04-20T09:32:30.236Z',
      dateEnd: '2024-04-20T09:32:30.236Z',
      categories: [],
      versions: [],
    });
  }

  editIntegration() {
    const integration = this.prepareIntegration();
    const mainVersion = this.currentIntegration$$.value?.versions?.find((version) => version.isFinal);
    const mainVersionName = this.currentIntegration$$.value?.mainVersionName;

    return this.integrationsClientService.patchIntegration(integration.id!, integration).pipe(
      mergeMap(() => this.updateCategories()),
      mergeMap(() => this.deleteCategories()),
      mergeMap(() =>
        mainVersion
          ? this.updateVersion(mainVersion?.id!, {
              name: mainVersionName!,
              isFinal: true,
            })
          : this.createVersion(integration.id!, mainVersionName!)
      ),
      catchError((err) => {
        console.log('err', err);
        return of('');
      })
    );
    //TODO: validations and errors
  }

  createIntegration() {
    return this.integrationsClientService.postIntegration(this.prepareIntegration(false)).pipe(
      mergeMap((integration) => this.updateCategories(integration.id).pipe(map(() => integration))),
      mergeMap((integration) =>
        this.createVersion(integration?.id!, this.currentIntegration$$.value?.mainVersionName!).pipe(
          map(() => integration)
        )
      )
    );
    //TODO: validations and errors
  }

  prepareIntegration(withId = true): Integration {
    const integration = this.currentIntegration$$.value!;

    return withId
      ? {
          id: +integration.id!,
          budget: +integration.budget,
          name: integration.name,
          participants: +integration.participants,
          picture: integration.picture,
          dateStart: integration.dateStart,
          dateEnd: integration.dateEnd,
        }
      : {
          budget: +integration.budget,
          name: integration.name,
          participants: +integration.participants,
          picture: integration.picture,
          dateStart: integration.dateStart,
          dateEnd: integration.dateEnd,
        };
  }

  setupStreamForAddedNewBudgetCategory(destroy$: Observable<void>): void {
    this.componentsCommunicationService.addedCategory$
      .pipe(
        tap((newBudgetCategory) => {
          this.currentIntegration$$.next({
            ...this.currentIntegration$$.value!,
            categories: [...this.currentIntegration$$.value?.categories!, newBudgetCategory],
          });
        }),
        takeUntil(destroy$)
      )
      .subscribe();
  }

  setupStreamForUpdatedBudgetPrimaryDetails(destroy$: Observable<void>): void {
    this.componentsCommunicationService.budgetPrimaryDetailsChanged$
      .pipe(
        tap((budgetPrimaryDetails) => {
          this.currentIntegration$$.next({
            ...this.currentIntegration$$.value!,
            ...budgetPrimaryDetails,
          });
        }),
        takeUntil(destroy$)
      )
      .subscribe();
  }

  setupStreamForDeletedBudgetCategory(destroy$: Observable<void>): void {
    this.componentsCommunicationService.deletedCategory$
      .pipe(
        tap((deletedCategoryIndex) => {
          const categoryToDelete = this.currentIntegration$$.value?.categories.splice(deletedCategoryIndex, 1)[0];

          this.currentIntegration$$.next({
            ...this.currentIntegration$$.value!,
          });

          if (categoryToDelete && !categoryToDelete?.isNewEntry) {
            this.categoriesToDelete$$.value.push(categoryToDelete);
          }
        }),
        takeUntil(destroy$)
      )
      .subscribe();
  }

  changeNameAndImageOfIntegration(nameAndImadeData: Pick<ExtendedIntegration, 'name' | 'picture'>): void {
    this.currentIntegration$$.next({
      ...this.currentIntegration$$.value!,
      name: nameAndImadeData.name,
      picture: nameAndImadeData.picture,
    });
  }

  updateCategories(integrationId?: number): Observable<any> {
    return this.currentIntegration$$.value?.categories?.length
      ? forkJoin(
          this.currentIntegration$$.value?.categories?.map((category) => {
            if (category?.isModified) {
              return this.categoriesService.patchCategory(category?.id!, {
                integrationId: category.integrationId,
                id: category.id,
                name: category.name,
              });
            }

            if (category?.isNewEntry) {
              return this.categoriesService.postCategory({
                integrationId: category.integrationId ?? integrationId,
                name: category.name,
              });
            }

            return of(' ');
          })!
        )
      : of(' ');
    // .pipe(map((responses) => responses.map(response => response )))
  }

  deleteCategories(): Observable<any> {
    return this.categoriesToDelete$$.value.length
      ? forkJoin(
          this.categoriesToDelete$$.value.map((category) => this.categoriesService.deleteCategory(category?.id!))
        )
      : of(' ');
  }

  createVersion(integrationId: number, versionName: string) {
    return this.versionsClientService.createVersion({
      name: versionName,
      integrationId,
      isFinal: true,
    });
  }

  updateVersion(id: number, version: Pick<Version, 'name' | 'isFinal'>) {
    return this.versionsClientService.patchVersion(id, version);
  }

  cleanup() {
    this.currentIntegration$$.next(null);
    this.categoriesToDelete$$.next([]);
  }
}
