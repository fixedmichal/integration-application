import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Version } from 'src/types';

@Component({
  selector: 'app-versions-list',
  standalone: true,
  imports: [NgClass, MatButtonModule, MatIconModule],
  templateUrl: './versions-list.component.html',
  styleUrl: './versions-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionsListComponent {
  @Input({ required: true }) versions!: Version[];
  @Output() selectedVersion = new EventEmitter<Version>();
  @Input() selectedVersionId: number | undefined;

  @ViewChild('ul') ul: ElementRef | undefined;
  private readonly SCROLL_WIDTH = 300;

  scrollRight(): void {
    if (this.ul) {
      (this.ul.nativeElement as HTMLUListElement).scrollBy({ left: this.SCROLL_WIDTH, behavior: 'smooth' });
    }
  }

  scrollLeft(): void {
    if (this.ul) {
      (this.ul.nativeElement as HTMLUListElement).scrollBy({ left: -this.SCROLL_WIDTH, behavior: 'smooth' });
    }
  }

  scrollToTheEnd(): void {
    if (this.ul) {
      const actualUlWidth = Array(...Array(this.ul.nativeElement)[0].children).reduce(
        (acc: number, curr: HTMLLIElement) => (acc = acc + curr.offsetWidth),
        0
      );

      (this.ul.nativeElement as HTMLUListElement).scrollBy({
        left: actualUlWidth,
        behavior: 'smooth',
      });
    }
  }

  selectVersion(version: Version): void {
    this.selectedVersion.emit(version);
    this.selectedVersionId = version.id;
  }
}
