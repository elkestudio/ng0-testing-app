import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { HeaderVariant, HeaderSize } from './header.types.js';

@Component({
  selector: 'ng0-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style.height.px]': 'heightPx()',
  },
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class Ng0HeaderComponent {
  readonly variant = input<HeaderVariant>('solid');
  readonly size = input<HeaderSize>('md');
  readonly fixed = input(false, {
    transform: (v: boolean | string) =>
      typeof v === 'string' ? v === '' || v === 'true' : v,
  });
  readonly sticky = input(false, {
    transform: (v: boolean | string) =>
      typeof v === 'string' ? v === '' || v === 'true' : v,
  });

  protected readonly heightPx = computed(() => {
    const heights: Record<HeaderSize, number> = {
      sm: 44,
      md: 56,
      lg: 64,
    };
    return heights[this.size()];
  });

  protected readonly hostClasses = computed(() => {
    const variantClasses: Record<HeaderVariant, string> = {
      transparent: 'bg-transparent',
      solid: 'bg-base-100 border-b border-base-border',
      blur: 'bg-base-100/80 backdrop-blur-md border-b border-base-border',
    };

    const positionClass = this.fixed()
      ? 'fixed top-0 left-0 right-0'
      : this.sticky()
        ? 'sticky top-0'
        : 'relative';

    return `${variantClasses[this.variant()]} ${positionClass}`;
  });
}
