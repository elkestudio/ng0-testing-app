import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { Ng0IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'ng0-widget-shell',
  standalone: true,
  imports: [Ng0IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './widget-shell.component.html',
  host: { class: 'block' },
})
export class WidgetShellComponent {
  readonly title = input.required<string>();
  readonly open = input(true);
  readonly variant = input<'default' | 'alt'>('default');

  protected readonly collapsed = signal(false);

  constructor() {
    // Sync initial open state after inputs resolve
    queueMicrotask(() => {
      this.collapsed.set(!this.open());
    });
  }

  protected toggle(): void {
    this.collapsed.set(!this.collapsed());
  }
}
