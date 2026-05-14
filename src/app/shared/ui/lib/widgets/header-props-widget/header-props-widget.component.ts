import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetSelectComponent, WidgetButtonGroupComponent, WidgetRowComponent } from '../widget-controls/index';
import type { HeaderPropsChange } from '../widget-prop-types';

@Component({
  selector: 'ng0-header-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetSelectComponent, WidgetButtonGroupComponent],
  templateUrl: './header-props-widget.component.html',
})
export class HeaderPropsWidgetComponent {
  readonly variant = input<string>('solid');
  readonly size = input<string>('md');
  readonly sticky = input<boolean>(false);
  readonly fixed = input<boolean>(false);
  readonly changed = output<HeaderPropsChange>();

  protected readonly variantOptions = [
    { value: 'solid', label: 'Solid' },
    { value: 'ghost', label: 'Ghost' },
    { value: 'outline', label: 'Outline' },
    { value: 'transparent', label: 'Transparent' },
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
