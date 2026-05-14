import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetRowComponent, WidgetTextComponent } from '../widget-controls/index';
import type { CheckboxPropsChange } from '../widget-prop-types';

@Component({
  selector: 'ng0-checkbox-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetTextComponent],
  templateUrl: './checkbox-props-widget.component.html',
})
export class CheckboxPropsWidgetComponent {
  readonly label = input<string>('');
  readonly changed = output<CheckboxPropsChange>();
}
