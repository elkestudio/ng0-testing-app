import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RadioSize, RadioColor } from './radio.types';

@Component({
  selector: 'ng0-radio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio.component.html',
  styles: [`
    .radio-circle {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      border: 2px solid var(--color-base-border, currentColor);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 150ms ease;
    }
    .radio-circle.checked {
      border-color: var(--radio-color, var(--color-primary));
    }
    .radio-circle .radio-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background-color: var(--radio-color, var(--color-primary));
      transform: scale(0);
      transition: transform 150ms ease;
    }
    .radio-circle.checked .radio-dot {
      transform: scale(1);
    }
    .radio-sm .radio-circle { width: 1rem; height: 1rem; }
    .radio-sm .radio-circle .radio-dot { width: 0.375rem; height: 0.375rem; }
    .radio-lg .radio-circle { width: 1.5rem; height: 1.5rem; }
    .radio-lg .radio-circle .radio-dot { width: 0.625rem; height: 0.625rem; }
  `],
})
export class Ng0RadioComponent {
  readonly value = input.required<string>();
  readonly name = input<string>('');
  readonly label = input<string>();
  readonly checked = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly radioSize = input<RadioSize>('md');
  readonly color = input<RadioColor>('primary');

  readonly selected = output<string>();

  protected readonly sizeClass = computed(() => `radio-${this.radioSize()}`);

  protected readonly colorStyle = computed(() => {
    const colors: Record<RadioColor, string> = {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      accent: 'var(--color-accent)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      error: 'var(--color-error)',
      info: 'var(--color-info)',
    };
    return colors[this.color()];
  });

  protected onSelect(): void {
    if (!this.disabled()) {
      this.selected.emit(this.value());
    }
  }
}
