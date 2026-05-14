import {
  Component,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Ng0IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ng0-empty-state',
  standalone: true,
  imports: [Ng0IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './empty-state.component.html',
})
export class Ng0EmptyStateComponent {
  readonly icon = input<string>();
  readonly title = input<string>();
  readonly description = input<string>();
}
