import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetSelectComponent, WidgetButtonGroupComponent, WidgetRowComponent, WidgetTextComponent, SIZE_OPTIONS_3 } from '../widget-controls/index';
import type { BadgePropsChange } from '../widget-prop-types';

@Component({
  selector: 'ng0-badge-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetSelectComponent, WidgetButtonGroupComponent, WidgetTextComponent],
  templateUrl: './badge-props-widget.component.html',
})
export class BadgePropsWidgetComponent {
  readonly content = input<string>('Badge');
  readonly variant = input<string>('primary');
  readonly size = input<string>('md');
  readonly changed = output<BadgePropsChange>();

  protected readonly variantOptions = [
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'accent', label: 'Accent' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'info', label: 'Info' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' },
  ];

  protected readonly sizeOptions = SIZE_OPTIONS_3;
}
