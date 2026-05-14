import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FabPosition } from './fab.types';

@Component({
  selector: 'ng0-fab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fab.component.html',
})
export class Ng0FabComponent {
  readonly position = input<FabPosition>('bottom-right');

  protected readonly positionClasses = computed(() => {
    const positions: Record<FabPosition, string> = {
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
    };
    return `fixed z-50 ${positions[this.position()]}`;
  });
}
