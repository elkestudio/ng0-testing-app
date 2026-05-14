import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetNumberComponent, WidgetSelectComponent, WidgetRowComponent, COLOR_OPTIONS } from '../widget-controls/index';
import type { ProgressPropsChange } from '../widget-prop-types';

@Component({
  selector: 'ng0-progress-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetNumberComponent, WidgetSelectComponent],
  templateUrl: './progress-props-widget.component.html',
})
export class ProgressPropsWidgetComponent {
  readonly value = input<number>(50);
  readonly max = input<number>(100);
  readonly color = input<string>('primary');
  readonly changed = output<ProgressPropsChange>();

  protected readonly colorOptions = COLOR_OPTIONS;
}
