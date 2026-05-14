import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'ng0-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': '"status"',
    '[attr.aria-live]': '"polite"',
    '[attr.aria-label]': '"Loading"',
  },
  templateUrl: './spinner.component.html',
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--color-primary);
      }
    `,
  ],
})
export class Ng0SpinnerComponent {
  readonly size = input<SpinnerSize>('md');

  readonly sizeClasses = computed(() => {
    const sizes: Record<SpinnerSize, string> = {
      xs: 'w-4 h-4',
      sm: 'w-5 h-5',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    };
    return sizes[this.size()];
  });

  readonly borderWidth = computed(() => {
    const widths: Record<SpinnerSize, string> = {
      xs: 'border-2',
      sm: 'border-2',
      md: 'border-[3px]',
      lg: 'border-4',
      xl: 'border-4',
    };
    return widths[this.size()];
  });
}
