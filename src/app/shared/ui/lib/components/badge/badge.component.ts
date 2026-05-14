import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BadgeVariant, BadgeSize, BadgeShape } from './badge.types.js';

@Component({
  selector: 'ng0-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ng0-badge' },
  templateUrl: './badge.component.html',
})
export class Ng0BadgeComponent {
  readonly variant = input<BadgeVariant>('neutral');
  readonly size = input<BadgeSize>('md');
  readonly shape = input<BadgeShape>('rounded');

  protected readonly badgeClasses = computed(() => {
    const variants: Record<BadgeVariant, string> = {
      success: 'bg-success/15 text-success border-success/20',
      danger: 'bg-error/15 text-error border-error/20',
      warning: 'bg-warning/15 text-warning border-warning/20',
      info: 'bg-info/15 text-info border-info/20',
      neutral: 'bg-neutral/15 text-neutral-content border-neutral/20',
      primary: 'bg-primary/15 text-primary border-primary/20',
    };

    const sizes: Record<BadgeSize, string> = {
      sm: 'text-xs px-1.5 py-0.5',
      md: 'text-sm px-2 py-0.5',
    };

    const shapes: Record<BadgeShape, string> = {
      square: 'rounded-none',
      rounded: 'rounded-md',
      pill: 'rounded-full',
    };

    return `inline-flex items-center font-medium border ${variants[this.variant()]} ${sizes[this.size()]} ${shapes[this.shape()]}`;
  });
}
