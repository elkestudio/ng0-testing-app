import {
  Component,
  input,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Ng0IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ng0-accordion-item',
  imports: [Ng0IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './accordion-item.component.html',
})
export class Ng0AccordionItemComponent {
  readonly title = input.required<string>();
  readonly expanded = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  isExpanded = signal(false);

  constructor() {
    // Sync initial state. Use effect in real impl for reactivity.
    setTimeout(() => this.isExpanded.set(this.expanded()), 0);
  }

  toggle(): void {
    if (this.disabled()) return;
    this.isExpanded.update(v => !v);
  }
}
