import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { VersionsService } from '@services/versions/versions.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, AsyncPipe, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly versionsService = inject(VersionsService);

  protected currentIntegrationName$ = this.versionsService.currentIntegrationName$;
}
