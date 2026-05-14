import {
  Component,
  input,
  output,
  computed,
  signal,
  ChangeDetectionStrategy,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RatingSize, RatingShape, RatingColor } from './rating.types';

@Component({
  selector: 'ng0-rating',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Ng0RatingComponent),
      multi: true,
    },
  ],
  styles: [`
    .mask-star {
      clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    }
    .mask-star-2 {
      clip-path: polygon(50% 0%, 64% 32%, 100% 38%, 74% 62%, 82% 100%, 50% 80%, 18% 100%, 26% 62%, 0% 38%, 36% 32%);
    }
    .mask-heart {
      clip-path: path('M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z');
    }
    .mask-half-1 {
      clip-path: polygon(50% 0%, 50% 100%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    }
    .mask-half-2 {
      clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 50% 100%, 50% 0%);
    }
    .rating input { appearance: none; -webkit-appearance: none; background-color: var(--color-base-300, #e2e8f0); }
    .rating-xs input { width: 0.75rem; height: 0.75rem; }
    .rating-sm input { width: 1rem; height: 1rem; }
    .rating-md input { width: 1.5rem; height: 1.5rem; }
    .rating-lg input { width: 2rem; height: 2rem; }
    .rating-xl input { width: 2.5rem; height: 2.5rem; }
    .rating:has(input:nth-of-type(1):checked) input:nth-of-type(1),
    .rating:has(input:nth-of-type(2):checked) input:nth-of-type(-n+2),
    .rating:has(input:nth-of-type(3):checked) input:nth-of-type(-n+3),
    .rating:has(input:nth-of-type(4):checked) input:nth-of-type(-n+4),
    .rating:has(input:nth-of-type(5):checked) input:nth-of-type(-n+5),
    .rating:has(input:nth-of-type(6):checked) input:nth-of-type(-n+6),
    .rating:has(input:nth-of-type(7):checked) input:nth-of-type(-n+7),
    .rating:has(input:nth-of-type(8):checked) input:nth-of-type(-n+8),
    .rating:has(input:nth-of-type(9):checked) input:nth-of-type(-n+9),
    .rating:has(input:nth-of-type(10):checked) input:nth-of-type(-n+10) {
      background-color: var(--rating-color);
    }
    .rating input:disabled { opacity: 0.5; cursor: not-allowed; }
    .rating.rating-readonly input { cursor: default; pointer-events: none; }
  `],
  templateUrl: './rating.component.html',
})
export class Ng0RatingComponent implements ControlValueAccessor {
  readonly max = input<number>(5);
  readonly size = input<RatingSize>('md');
  readonly shape = input<RatingShape>('star-2');
  readonly color = input<RatingColor>('warning');
  readonly half = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string>('Rating');

  readonly valueChange = output<number>();

  protected readonly value = signal<number>(0);
  protected readonly isDisabled = signal<boolean>(false);

  protected readonly uniqueName = `rating-${Math.random().toString(36).substring(2, 9)}`;

  private _onChange: (value: number) => void = () => {};
  private _onTouched: () => void = () => {};

  protected readonly containerClasses = computed(() => {
    const classes = [`rating rating-${this.size()}`];
    if (this.readonly()) classes.push('rating-readonly');
    return classes.join(' ');
  });

  protected readonly colorVar = computed(() => {
    const map: Record<RatingColor, string> = {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      accent: 'var(--color-accent)',
      warning: 'var(--color-warning)',
      success: 'var(--color-success)',
      error: 'var(--color-error)',
      info: 'var(--color-info)',
    };
    return map[this.color()];
  });

  protected readonly items = computed(() =>
    Array.from({ length: this.max() }, (_, i) => i + 1)
  );

  protected readonly halfItems = computed(() => {
    const result: { value: number; isHalf: boolean }[] = [];
    for (let i = 1; i <= this.max(); i++) {
      result.push({ value: i - 0.5, isHalf: true });
      result.push({ value: i, isHalf: false });
    }
    return result;
  });

  protected getShapeClass(isHalf?: boolean, isFirst?: boolean): string {
    const base = `mask-${this.shape()}`;
    if (!isHalf) return base;
    return isFirst ? `${base} mask-half-1` : `${base} mask-half-2`;
  }

  protected onRatingChange(rating: number): void {
    if (this.readonly() || this.disabled() || this.isDisabled()) return;
    this.value.set(rating);
    this._onChange(rating);
    this._onTouched();
    this.valueChange.emit(rating);
  }

  writeValue(val: number): void {
    this.value.set(val ?? 0);
  }

  registerOnChange(fn: (value: number) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
