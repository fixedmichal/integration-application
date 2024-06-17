import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Integration } from '../../../types';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-integration-tile',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './integration-tile.component.html',
  styleUrl: './integration-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationTileComponent {
  @Input() integration!: Integration;
}
