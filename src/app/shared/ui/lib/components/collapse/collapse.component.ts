import {
  Component,
  input,
  model,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Ng0IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ng0-collapse',
  standalone: true,
  imports: [Ng0IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './collapse.component.html',
  styles: [`
    .collapse-content {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 200ms ease;
    }
    .collapse-content.open {
      grid-template-rows: 1fr;
    }
    .collapse-content > div {
      overflow: hidden;
    }
  `],
})
export class Ng0CollapseComponent {
  readonly title = input.required<string>();
  readonly icon = input<string>();
  readonly open = model<boolean>(false);

  protected toggle(): void {
    this.open.update(v => !v);
  }
}
