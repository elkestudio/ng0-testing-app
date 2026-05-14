import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Ng0IconComponent } from '../icon/icon.component';
import { ChipVariant, ChipSize, ChipColor } from './chip.types';

@Component({
  selector: 'ng0-chip',
  standalone: true,
  imports: [Ng0IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(keydown.delete)': 'onRemoveKey()',
    '(keydown.backspace)': 'onRemoveKey()',
  },
  templateUrl: './chip.component.html',
})
export class Ng0ChipComponent {
  readonly variant = input<ChipVariant>('solid');
  readonly size = input<ChipSize>('md');
  readonly color = input<ChipColor>('neutral');
  readonly removable = input<boolean>(false);

  readonly removed = output<void>();

  protected readonly chipClasses = computed(() => {
    const colors: Record<ChipColor, Record<ChipVariant, string>> = {
      primary: {
        solid: 'bg-primary text-primary-content',
        outlined: 'border border-primary text-primary bg-transparent',
        ghost: 'bg-primary/10 text-primary',
      },
      secondary: {
        solid: 'bg-secondary text-secondary-content',
        outlined: 'border border-secondary text-secondary bg-transparent',
        ghost: 'bg-secondary/10 text-secondary',
      },
      accent: {
        solid: 'bg-accent text-accent-content',
        outlined: 'border border-accent text-accent bg-transparent',
        ghost: 'bg-accent/10 text-accent',
      },
      neutral: {
        solid: 'bg-neutral text-neutral-content',
        outlined: 'border border-neutral text-neutral bg-transparent',
        ghost: 'bg-neutral/10 text-neutral-content',
      },
      success: {
        solid: 'bg-success text-success-content',
        outlined: 'border border-success text-success bg-transparent',
        ghost: 'bg-success/10 text-success',
      },
      warning: {
        solid: 'bg-warning text-warning-content',
        outlined: 'border border-warning text-warning bg-transparent',
        ghost: 'bg-warning/10 text-warning',
      },
      error: {
        solid: 'bg-error text-error-content',
        outlined: 'border border-error text-error bg-transparent',
        ghost: 'bg-error/10 text-error',
      },
      info: {
        solid: 'bg-info text-info-content',
        outlined: 'border border-info text-info bg-transparent',
        ghost: 'bg-info/10 text-info',
      },
    };

    const sizes: Record<ChipSize, string> = {
      xs: 'text-xs px-1.5 py-0 gap-1',
      sm: 'text-xs px-2 py-0.5 gap-1',
      md: 'text-sm px-2.5 py-1 gap-1.5',
      lg: 'text-base px-3 py-1.5 gap-2',
    };

    return `inline-flex items-center rounded-full font-medium ${colors[this.color()][this.variant()]} ${sizes[this.size()]}`;
  });

  protected onRemoveKey(): void {
    if (this.removable()) {
      this.removed.emit();
    }
  }

  protected remove(): void {
    this.removed.emit();
  }
}
