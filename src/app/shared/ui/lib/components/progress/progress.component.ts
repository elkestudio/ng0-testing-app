import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressColor = 'primary' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'ng0-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
  host: {
    '[attr.role]': '"progressbar"',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-label]': 'ariaLabel() || "Progress"',
  },
  templateUrl: './progress.component.html',
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
      }
    `,
  ],
})
export class Ng0ProgressComponent {
  readonly value = input<number>(0);
  readonly max = input<number>(100);
  readonly size = input<ProgressSize>('md');
  readonly color = input<ProgressColor>('primary');
  readonly showLabel = input<boolean>(false);
  readonly ariaLabel = input<string>();

  readonly percentage = computed(() => {
    const val = this.value();
    const maxVal = this.max();
    return Math.min(100, Math.max(0, (val / maxVal) * 100));
  });

  readonly barSizeClasses = computed(() => {
    const sizes: Record<ProgressSize, string> = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-4',
    };
    return sizes[this.size()];
  });

  readonly colorClass = computed(() => {
    const colors: Record<ProgressColor, string> = {
      primary: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      danger: 'bg-error',
    };
    return colors[this.color()];
  });
}
