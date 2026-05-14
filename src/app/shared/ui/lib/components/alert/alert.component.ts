import {
  Component,
  input,
  output,
  computed,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Ng0IconComponent } from '../icon/icon.component';
import { AlertVariant } from './alert.types';

@Component({
  selector: 'ng0-alert',
  standalone: true,
  imports: [Ng0IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alert.component.html',
})
export class Ng0AlertComponent {
  readonly variant = input<AlertVariant>('info');
  readonly dismissible = input<boolean>(false);
  readonly icon = input<string>();

  readonly dismissed = output<void>();

  protected readonly visible = signal(true);

  protected readonly variantClasses = computed(() => {
    const variants: Record<AlertVariant, string> = {
      info: 'bg-info/10 border-info/20 text-info',
      success: 'bg-success/10 border-success/20 text-success',
      warning: 'bg-warning/10 border-warning/20 text-warning',
      danger: 'bg-error/10 border-error/20 text-error',
    };
    return variants[this.variant()];
  });

  protected readonly iconName = computed(() => {
    if (this.icon()) return this.icon()!;
    const icons: Record<AlertVariant, string> = {
      info: 'Info',
      success: 'CheckCircle',
      warning: 'AlertTriangle',
      danger: 'AlertCircle',
    };
    return icons[this.variant()];
  });

  dismiss(): void {
    this.visible.set(false);
    this.dismissed.emit();
  }
}
