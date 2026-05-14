import {
  Component,
  input,
  output,
  signal,
  effect,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { Ng0IconComponent } from '../icon/icon.component';
import { ModalSize, ModalAnimation } from './modal.types.js';

@Component({
  selector: 'ng0-modal',
  imports: [Ng0IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
  host: { style: 'display: contents' },
})
export class Ng0ModalComponent {
  readonly open = input<boolean>(false);
  readonly size = input<ModalSize>('md');
  readonly animation = input<ModalAnimation>('scale');
  readonly closeOnBackdrop = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);
  readonly showClose = input<boolean>(true);
  readonly noPadding = input<boolean>(false);
  readonly ariaLabel = input<string>();

  readonly closed = output<void>();

  isVisible = signal(false);
  isClosing = signal(false);

  constructor() {
    effect(() => {
      if (this.open()) {
        this.isClosing.set(false);
        this.isVisible.set(true);
      } else if (this.isVisible()) {
        this.isClosing.set(true);
        setTimeout(() => {
          this.isVisible.set(false);
          this.isClosing.set(false);
        }, 200);
      }
    });
  }

  close(): void {
    this.closed.emit();
  }

  protected readonly dialogClasses = computed(() => {
    const pad = this.noPadding() ? 'p-0' : 'p-6';
    const base = `relative bg-base-100 rounded-xl shadow-xl ${pad} z-10 transition-all duration-200`;
    const animClass = this.isClosing()
      ? 'opacity-0 scale-95'
      : 'opacity-100 scale-100';

    return `${base} ${animClass}`;
  });

  protected readonly dialogWidth = computed(() => {
    const sizeStyles: Record<ModalSize, string> = {
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      full: 'calc(100vw - 2rem)',
    };
    return sizeStyles[this.size()];
  });
}
