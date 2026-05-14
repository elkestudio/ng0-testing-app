import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

export type JoinDirection = 'horizontal' | 'vertical';

@Component({
  selector: 'ng0-join',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'joinClasses()',
  },
  templateUrl: './join.component.html',
  styles: [
    `
      :host {
        display: inline-flex;
      }

      :host.join-horizontal > ::ng-deep * {
        border-radius: 0;
      }
      :host.join-horizontal > ::ng-deep *:first-child {
        border-top-left-radius: var(--radius-lg);
        border-bottom-left-radius: var(--radius-lg);
      }
      :host.join-horizontal > ::ng-deep *:last-child {
        border-top-right-radius: var(--radius-lg);
        border-bottom-right-radius: var(--radius-lg);
      }
      :host.join-horizontal > ::ng-deep *:not(:first-child) {
        border-left-width: 0;
      }

      :host.join-vertical {
        flex-direction: column;
      }
      :host.join-vertical > ::ng-deep * {
        border-radius: 0;
      }
      :host.join-vertical > ::ng-deep *:first-child {
        border-top-left-radius: var(--radius-lg);
        border-top-right-radius: var(--radius-lg);
      }
      :host.join-vertical > ::ng-deep *:last-child {
        border-bottom-left-radius: var(--radius-lg);
        border-bottom-right-radius: var(--radius-lg);
      }
      :host.join-vertical > ::ng-deep *:not(:first-child) {
        border-top-width: 0;
      }
    `,
  ],
})
export class Ng0JoinComponent {
  readonly direction = input<JoinDirection>('horizontal');

  protected readonly joinClasses = computed(() => {
    return `join-${this.direction()}`;
  });
}
