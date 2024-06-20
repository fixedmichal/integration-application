import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VersionActionsViewConfiguration } from 'src/types/view-configuration-types/version-actions-view-config.type';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VersionsComponentsCommunicationService } from '@services/versions-components-communication/versions-components-communication.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-version-actions',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, MatProgressSpinnerModule, NgClass],
  templateUrl: './version-actions.component.html',
  styleUrl: './version-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionActionsComponent implements OnInit, OnDestroy {
  @Input({ required: true }) versionName!: string;
  @Input({ required: true }) versionId!: number;

  @Input({ required: true }) viewConfig!: VersionActionsViewConfiguration;

  @Output() delete = new EventEmitter();
  @Output() setAsMain = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() duplicate = new EventEmitter();
  @Output() nameEdit = new EventEmitter<{ id: number; name: string }>();

  private readonly versionsComponentsCommunicationService = inject(VersionsComponentsCommunicationService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected isDuplicatingInprogress = false;
  private destroy$$ = new Subject<void>();

  ngOnInit(): void {
    this.versionsComponentsCommunicationService.versionDuplicationNotInProgress$
      .pipe(
        tap((versionId) => {
          if (this.versionId === versionId) {
            this.isDuplicatingInprogress = false;
            this.cdr.markForCheck();
          }
        }),
        takeUntil(this.destroy$$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }

  onDeleteClick(): void {
    this.delete.emit();
  }

  onEditClick() {
    this.edit.emit();
  }

  onEditNameClick() {
    this.nameEdit.emit({ id: this.versionId, name: this.versionName });
  }

  onSetAsMainClick() {
    this.setAsMain.emit();
  }

  onDuplicateClick(): void {
    this.duplicate.emit();
    this.isDuplicatingInprogress = !this.isDuplicatingInprogress;
  }
}
