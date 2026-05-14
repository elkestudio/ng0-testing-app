import { Component, input, ChangeDetectionStrategy } from '@angular/core';

export type DividerOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'ng0-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ng0-divider' },
  templateUrl: './divider.component.html',
})
export class Ng0DividerComponent {
  readonly orientation = input<DividerOrientation>('horizontal');
  readonly label = input<string>();
}
