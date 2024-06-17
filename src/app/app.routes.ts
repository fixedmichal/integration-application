import { Routes } from '@angular/router';
import { IntegrationListPageComponent } from './pages/integration-list-page/integration-list-page.component';
import { UpdateIntegrationPageComponent } from './pages/update-integration-page/update-integration-page.component';
import { CreateIntegrationPageComponent } from './pages/create-integration-page/create-integration-page.component';
import { ConfigureVersionsPageComponent } from '@pages/configure-versions-page/configure-versions-page.component';

export const routes: Routes = [
  { path: 'update/:id', component: UpdateIntegrationPageComponent },
  { path: 'configure/:id', component: ConfigureVersionsPageComponent },
  { path: 'create', component: CreateIntegrationPageComponent },
  {
    path: '',
    pathMatch: 'full',
    component: IntegrationListPageComponent,
  },
  { path: '**', redirectTo: '' },
];
