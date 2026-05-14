import {
  Component,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Ng0ToastComponent } from './toast.component';
import { ToastData, ToastPosition } from './toast.types';

@Component({
  selector: 'ng0-toast-container',
  standalone: true,
  imports: [Ng0ToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast-container.component.html',
})
export class Ng0ToastContainerComponent {
  readonly toasts = signal<ToastData[]>([]);
  position: ToastPosition = 'bottom-right';

  protected readonly positionClasses = computed(() => {
    const positions: Record<ToastPosition, string> = {
      'top-left': 'top-0 left-0 items-start',
      'top-center': 'top-0 left-1/2 -translate-x-1/2 items-center',
      'top-right': 'top-0 right-0 items-end',
      'bottom-left': 'bottom-0 left-0 items-start',
      'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 items-center',
      'bottom-right': 'bottom-0 right-0 items-end',
    };
    return `fixed z-[9999] flex flex-col gap-2 p-4 pointer-events-none ${positions[this.position]}`;
  });

  addToast(toast: ToastData): void {
    this.toasts.update((current) => [...current, toast]);
  }

  removeToast(id: string): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
