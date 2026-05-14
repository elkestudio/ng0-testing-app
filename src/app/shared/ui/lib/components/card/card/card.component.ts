import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CardShape } from '../card.types.js';

@Component({
  selector: 'ng0-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'cardClasses()',
  },
  templateUrl: './card.component.html',
})
export class Ng0CardComponent {
  readonly bordered = input(true, {
    transform: (v: boolean | string) =>
      typeof v === 'string' ? v === '' || v === 'true' : v,
  });
  readonly compact = input(false, {
    transform: (v: boolean | string) =>
      typeof v === 'string' ? v === '' || v === 'true' : v,
  });
  readonly hoverable = input(false, {
    transform: (v: boolean | string) =>
      typeof v === 'string' ? v === '' || v === 'true' : v,
  });
  readonly shape = input<CardShape>('rounded');

  protected readonly cardClasses = computed(() => {
    const shapeClasses: Record<CardShape, string> = {
      square: 'rounded-none',
      rounded: 'rounded-lg',
      xl: 'rounded-xl',
    };

    const base = 'bg-base-100 overflow-hidden';
    const border = this.bordered() ? 'border border-base-border' : '';
    const shadow = 'shadow-sm';
    const hover = this.hoverable()
      ? 'transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer'
      : '';
    const padding = this.compact() ? '' : 'p-4';

    return `${base} ${shapeClasses[this.shape()]} ${border} ${shadow} ${hover} ${padding}`;
  });
}
