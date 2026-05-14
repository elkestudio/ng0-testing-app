import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetSelectComponent, WidgetButtonGroupComponent, WidgetRowComponent, WidgetTextComponent, SIZE_OPTIONS_4 } from '../widget-controls/index';
import type { InputPropsChange } from '../widget-prop-types';

@Component({
  selector: 'ng0-input-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetSelectComponent, WidgetButtonGroupComponent, WidgetTextComponent],
  templateUrl: './input-props-widget.component.html',
})
export class InputPropsWidgetComponent {
  readonly placeholder = input<string>('');
  readonly variant = input<string>('bordered');
  readonly size = input<string>('md');
  readonly changed = output<InputPropsChange>();

  protected readonly variantOptions = [
    { value: 'bordered', label: 'Bordered' },
    { value: 'ghost', label: 'Ghost' },
    { value: 'underline', label: 'Underline' },
  ];

  protected readonly sizeOptions = SIZE_OPTIONS_4;
}
