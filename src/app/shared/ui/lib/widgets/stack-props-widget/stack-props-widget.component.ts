import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetSelectComponent, WidgetButtonGroupComponent, WidgetRowComponent } from '../widget-controls/index';
import type { StackPropsChange } from '../widget-prop-types';

@Component({
  selector: 'ng0-stack-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetSelectComponent, WidgetButtonGroupComponent],
  templateUrl: './stack-props-widget.component.html',
})
export class StackPropsWidgetComponent {
  readonly direction = input<string>('column');
  readonly gap = input<string>('md');
  readonly align = input<string>('stretch');
  readonly justify = input<string>('start');
  readonly wrap = input<boolean>(false);
  readonly reverse = input<boolean>(false);
  readonly overflow = input<string>('hidden');
  readonly changed = output<StackPropsChange>();

  protected readonly directionOptions = [
    { value: 'column', label: 'Column', icon: 'view_agenda' },
    { value: 'row', label: 'Row', icon: 'view_week' },
  ];

  protected readonly gapOptions = [
    { value: 'none', label: 'None' }, { value: 'xs', label: 'XS' }, { value: 'sm', label: 'SM' },
    { value: 'md', label: 'MD' }, { value: 'lg', label: 'LG' }, { value: 'xl', label: 'XL' },
    { value: '2xl', label: '2XL' }, { value: '3xl', label: '3XL' },
  ];

  protected readonly alignColumnOptions = [
    { value: 'start', label: 'Start', icon: 'format_align_left' },
    { value: 'center', label: 'Center', icon: 'format_align_center' },
    { value: 'end', label: 'End', icon: 'format_align_right' },
    { value: 'stretch', label: 'Stretch', icon: 'expand' },
  ];

  protected readonly alignRowOptions = [
    { value: 'start', label: 'Start', icon: 'vertical_align_top' },
    { value: 'center', label: 'Center', icon: 'vertical_align_center' },
    { value: 'end', label: 'End', icon: 'vertical_align_bottom' },
    { value: 'stretch', label: 'Stretch', icon: 'expand' },
    { value: 'baseline', label: 'Baseline', icon: 'format_line_spacing' },
  ];

  protected readonly justifyColumnOptions = [
    { value: 'start', label: 'Start', icon: 'vertical_align_top' },
    { value: 'center', label: 'Center', icon: 'vertical_align_center' },
    { value: 'end', label: 'End', icon: 'vertical_align_bottom' },
    { value: 'between', label: 'Between', icon: 'format_align_justify' },
    { value: 'around', label: 'Around', icon: 'horizontal_distribute' },
  ];

  protected readonly justifyRowOptions = [
    { value: 'start', label: 'Start', icon: 'align_horizontal_left' },
    { value: 'center', label: 'Center', icon: 'align_horizontal_center' },
    { value: 'end', label: 'End', icon: 'align_horizontal_right' },
    { value: 'between', label: 'Between', icon: 'horizontal_distribute' },
    { value: 'around', label: 'Around', icon: 'format_align_justify' },
    { value: 'evenly', label: 'Evenly', icon: 'view_column' },
  ];

  protected readonly boolOptions = [
    { value: 'false', label: 'Off' },
    { value: 'true', label: 'On' },
  ];
}
