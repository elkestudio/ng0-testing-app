import {
  Component,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';

export type StackDirection = 'bottom' | 'top' | 'start' | 'end';

@Component({
  selector: 'ng0-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative inline-grid',
    '[style.grid-template-columns]': '"1fr"',
    '[style.grid-template-rows]': '"1fr"',
  },
  templateUrl: './stack.component.html',
  styles: [
    `
      :host ::ng-deep > * {
        grid-column: 1 / -1;
        grid-row: 1 / -1;
      }
    `,
  ],
})
export class Ng0StackComponent {
  readonly direction = input<StackDirection>('bottom');
}
