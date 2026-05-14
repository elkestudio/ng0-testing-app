import {
  Component,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Ng0IconComponent } from '../icon/icon.component';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  separator?: boolean;
}

@Component({
  selector: 'ng0-menu',
  imports: [Ng0IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu.component.html',
  styles: [
    `
      :host {
        position: relative;
        display: inline-block;
      }
    `,
  ],
})
export class Ng0MenuComponent {
  readonly items = input<MenuItem[]>([]);
  readonly closeOnLeave = input<boolean>(true);

  readonly itemSelected = output<MenuItem>();

  isOpen = signal(false);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen.update(v => !v);
  }

  select(item: MenuItem): void {
    if (item.disabled) return;
    this.itemSelected.emit(item);
    this.close();
  }
}
