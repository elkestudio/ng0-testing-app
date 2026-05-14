import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetButtonGroupComponent, WidgetRowComponent } from '../widget-controls/index';
import type { DividerPropsChange } from '../widget-prop-types';

@Component({
  selector: 'ng0-divider-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetButtonGroupComponent],
  templateUrl: './divider-props-widget.component.html',
})
export class DividerPropsWidgetComponent {
  readonly orientation = input<string>('horizontal');
  readonly changed = output<DividerPropsChange>();

  protected readonly orientationOptions = [
    { value: 'horizontal', label: 'Horizontal', icon: 'horizontal_rule' },
    { value: 'vertical', label: 'Vertical', icon: 'vertical_shades' },
  ];
}
