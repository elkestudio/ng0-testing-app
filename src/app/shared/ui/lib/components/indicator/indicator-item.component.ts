import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { IndicatorPosition } from './indicator.types';

@Component({
  selector: 'ng0-indicator-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './indicator-item.component.html',
})
export class Ng0IndicatorItemComponent {
  readonly position = input<IndicatorPosition>('top-end');

  protected readonly positionClasses = computed(() => {
    const positions: Record<IndicatorPosition, string> = {
      'top-start': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
      'top-center': 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
      'top-end': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
      'middle-start': 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2',
      'middle-center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      'middle-end': 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2',
      'bottom-start': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
      'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
      'bottom-end': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
    };
    return `absolute z-10 ${positions[this.position()]}`;
  });
}
