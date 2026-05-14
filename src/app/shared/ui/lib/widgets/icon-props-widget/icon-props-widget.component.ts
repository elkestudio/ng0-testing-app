import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetNumberComponent, WidgetTextComponent, WidgetRowComponent } from '../widget-controls/index';
import type { IconPropsChange } from '../widget-prop-types';

@Component({
  selector: 'ng0-icon-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetNumberComponent, WidgetTextComponent],
  templateUrl: './icon-props-widget.component.html',
})
export class IconPropsWidgetComponent {
  readonly name = input<string>('star');
  readonly size = input<number>(24);
  readonly changed = output<IconPropsChange>();
}
