import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetNumberComponent, WidgetRowComponent } from '../widget-controls/index';
import type { SliderPropsChange } from '../widget-prop-types';

@Component({
  selector: 'ng0-slider-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetNumberComponent],
  templateUrl: './slider-props-widget.component.html',
})
export class SliderPropsWidgetComponent {
  readonly min = input<number>(0);
  readonly max = input<number>(100);
  readonly value = input<number>(50);
  readonly changed = output<SliderPropsChange>();
}
