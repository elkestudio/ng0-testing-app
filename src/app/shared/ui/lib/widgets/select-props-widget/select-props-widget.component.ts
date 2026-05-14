import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetRowComponent, WidgetTextComponent } from '../widget-controls/index';
import type { SelectPropsChange } from '../widget-prop-types';

@Component({
  selector: 'ng0-select-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetTextComponent],
  templateUrl: './select-props-widget.component.html',
})
export class SelectPropsWidgetComponent {
  readonly placeholder = input<string>('');
  readonly changed = output<SelectPropsChange>();
}
