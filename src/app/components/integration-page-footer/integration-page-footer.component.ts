import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { IntegrationFormsService } from '@services/integrations-forms/integration-forms.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-integration-page-footer',
  standalone: true,
  imports: [RouterLink, MatButtonModule, AsyncPipe],
  templateUrl: './integration-page-footer.component.html',
  styleUrl: './integration-page-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationPageFooterComponent {
  @Output() actionButtonClicked = new EventEmitter<void>();
  @Input({ required: true }) actionButtonText!: string;

  private readonly integrationFormsService = inject(IntegrationFormsService);

  isActionButtonDisabled$ = this.integrationFormsService.areIntegrationFormsValid$.pipe(
    map((areFormsValid) => !areFormsValid)
  );

  onActionButtonClick(): void {
    this.actionButtonClicked.emit();
  }
}
