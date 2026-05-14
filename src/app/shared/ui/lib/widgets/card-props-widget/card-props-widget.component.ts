import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetButtonGroupComponent, WidgetSelectComponent, WidgetRowComponent, SHAPE_OPTIONS_CARD, BORDERED_OPTIONS, BOOL_OPTIONS } from '../widget-controls/index';
import type { CardPropsChange } from '../widget-prop-types';

@Component({
  selector: 'ng0-card-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetButtonGroupComponent, WidgetSelectComponent],
  templateUrl: './card-props-widget.component.html',
})
export class CardPropsWidgetComponent {
  readonly bordered = input<boolean>(true);
  readonly shape = input<string>('rounded');
  readonly compact = input<boolean>(false);
  readonly changed = output<CardPropsChange>();

  protected readonly borderedOptions = BORDERED_OPTIONS;

  protected readonly shapeOptions = SHAPE_OPTIONS_CARD;

  protected readonly compactOptions = BOOL_OPTIONS;
}
