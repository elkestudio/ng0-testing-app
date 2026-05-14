import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetButtonGroupComponent, WidgetRowComponent } from '../widget-controls/index';
import type { DockPropsChange } from '../widget-prop-types';

@Component({
  selector: 'ng0-dock-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetButtonGroupComponent],
  templateUrl: './dock-props-widget.component.html',
})
export class DockPropsWidgetComponent {
  readonly position = input<string>('bottom');
  readonly size = input<string>('md');
  readonly fixed = input<boolean>(false);
  readonly floating = input<boolean>(false);
  readonly changed = output<DockPropsChange>();

  protected readonly positionOptions = [
    { value: 'top', label: 'Top', icon: 'vertical_align_top' },
    { value: 'bottom', label: 'Bottom', icon: 'vertical_align_bottom' },
  ];

  protected readonly sizeOptions = [
    { value: 'sm', label: 'SM' },
    { value: 'md', label: 'MD' },
    { value: 'lg', label: 'LG' },
  ];

  protected readonly boolOptions = [
    { value: 'false', label: 'Off' },
    { value: 'true', label: 'On' },
  ];
}
