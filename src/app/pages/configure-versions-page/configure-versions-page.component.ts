import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VersionEditorComponent } from '@components/version-editor/version-editor.component';
import { IntegrationsService } from '@services/integration/integrations.service';
import { Subject, filter, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-configure-versions-page',
  standalone: true,
  imports: [VersionEditorComponent, AsyncPipe],
  templateUrl: './configure-versions-page.component.html',
  styleUrl: './configure-versions-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigureVersionsPageComponent implements OnInit, OnDestroy {
  constructor(private integrationService: IntegrationsService, private activatedRoute: ActivatedRoute) {}

  private destroy$ = new Subject<void>();

  protected integrationId$ = this.activatedRoute.params.pipe(
    map((activatedRoute) => activatedRoute['id'] as number),
    filter((id) => Boolean(id)),
    takeUntil(this.destroy$)
  );

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.integrationService.cleanup();
  }
}
