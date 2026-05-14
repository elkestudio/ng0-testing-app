import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ButtonVariant, ButtonSize, ButtonShape } from './button.types.js';

@Component({
  selector: 'ng0-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ng0-button' },
  templateUrl: './button.component.html',
})
export class Ng0ButtonComponent {
  readonly variant = input<ButtonVariant>('solid');
  readonly size = input<ButtonSize>('md');
  readonly shape = input<ButtonShape>('default');
  readonly disabled = input<boolean>(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly fullWidth = input<boolean>(false);
  readonly iconOnly = input<boolean>(false);
  readonly btnClass = input<string>('');
  readonly label = input<string>('');

  readonly buttonClick = output<MouseEvent>();

  protected readonly buttonClasses = computed(() => {
    const base =
      'inline-flex items-center font-medium transition-colors focus:outline-none gap-2';

    const iconOnlySizeClasses: Record<ButtonSize, string> = {
      xs: 'w-6 h-6 p-0',
      sm: 'w-8 h-8 p-0',
      md: 'w-10 h-10 p-0',
      lg: 'w-12 h-12 p-0',
    };

    const textSizeClasses: Record<ButtonSize, string> = {
      xs: 'px-2 py-1 text-xs gap-1',
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2.5 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5',
    };

    const sizeClasses = this.iconOnly() ? iconOnlySizeClasses : textSizeClasses;

    const shapeClasses: Record<ButtonShape, string> = {
      default: 'rounded-md',
      rounded: 'rounded-lg',
      square: 'rounded-none',
      pill: 'rounded-full',
      circle: 'rounded-full',
      fab: 'rounded-full',
    };

    const variantClasses: Record<ButtonVariant, string> = {
      solid:
        'border border-transparent justify-center bg-primary text-primary-content hover:bg-primary/90 disabled:bg-base-300 disabled:border-base-content/5 disabled:text-base-content/40',
      outline:
        'justify-center bg-transparent border border-base-border text-base-content hover:bg-base-200 disabled:border-base-content/10 disabled:text-base-content/40',
      ghost:
        'justify-center bg-transparent text-base-content hover:bg-base-200 disabled:text-base-content/40',
      soft:
        'justify-center bg-primary/10 text-primary hover:bg-primary/15 disabled:bg-primary/5 disabled:text-primary/40',
    };

    const widthClass = this.fullWidth() ? 'w-full' : '';
    const cursorClass = this.disabled()
      ? 'cursor-not-allowed opacity-60'
      : 'cursor-pointer';

    return `${base} ${sizeClasses[this.size()]} ${shapeClasses[this.shape()]} ${variantClasses[this.variant()]} ${widthClass} ${cursorClass}`.trim();
  });

  onClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.buttonClick.emit(event);
    }
  }
}
