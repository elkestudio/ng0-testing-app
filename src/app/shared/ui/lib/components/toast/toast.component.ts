import {
  Component,
  input,
  output,
  signal,
  computed,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Ng0IconComponent } from '../icon/icon.component';
import { ToastVariant } from './toast.types';

@Component({
  selector: 'ng0-toast',
  standalone: true,
  imports: [Ng0IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast.component.html',
})
export class Ng0ToastComponent implements OnInit, OnDestroy {
  readonly id = input.required<string>();
  readonly message = input.required<string>();
  readonly variant = input<ToastVariant>('info');
  readonly duration = input<number>(3000);

  readonly dismiss = output<string>();

  protected readonly isVisible = signal(false);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  protected readonly variantClasses = computed(() => {
    const variants: Record<ToastVariant, string> = {
      info: 'bg-base-100 border-base-border text-base-content',
      success: 'bg-success/10 border-success/20 text-success',
      warning: 'bg-warning/10 border-warning/20 text-warning',
      error: 'bg-error/10 border-error/20 text-error',
    };
    return variants[this.variant()];
  });

  protected readonly iconName = computed(() => {
    const icons: Record<ToastVariant, string> = {
      info: 'Info',
      success: 'CheckCircle',
      warning: 'AlertTriangle',
      error: 'AlertCircle',
    };
    return icons[this.variant()];
  });

  ngOnInit(): void {
    setTimeout(() => this.isVisible.set(true), 10);
    if (this.duration() > 0) {
      this.timeoutId = setTimeout(() => this.close(), this.duration());
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  close(): void {
    this.isVisible.set(false);
    setTimeout(() => this.dismiss.emit(this.id()), 300);
  }
}
