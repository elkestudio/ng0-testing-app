import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetRowComponent, WidgetTextComponent } from '../widget-controls/index';
import type { TogglePropsChange } from '../widget-prop-types';

@Component({
  selector: 'ng0-toggle-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetTextComponent],
  templateUrl: './toggle-props-widget.component.html',
})
export class TogglePropsWidgetComponent {
  readonly label = input<string>('');
  readonly changed = output<TogglePropsChange>();
}
