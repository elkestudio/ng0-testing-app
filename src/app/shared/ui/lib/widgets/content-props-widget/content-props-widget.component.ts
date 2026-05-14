import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetSelectComponent, WidgetButtonGroupComponent, WidgetRowComponent } from '../widget-controls/index';
import type { ContentPropsChange } from '../widget-prop-types';

@Component({
  selector: 'ng0-content-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetSelectComponent, WidgetButtonGroupComponent],
  templateUrl: './content-props-widget.component.html',
})
export class ContentPropsWidgetComponent {
  readonly padding = input<string>('none');
  readonly fullscreen = input<boolean>(false);
  readonly overflow = input<string>('hidden');
  readonly changed = output<ContentPropsChange>();

  protected readonly paddingOptions = [
    { value: 'none', label: 'None' },
    { value: 'xs', label: 'XS' },
    { value: 'sm', label: 'SM' },
    { value: 'md', label: 'MD' },
    { value: 'lg', label: 'LG' },
    { value: 'xl', label: 'XL' },
  ];

  protected readonly fullscreenOptions = [
    { value: 'false', label: 'No', icon: 'fullscreen_exit' },
    { value: 'true', label: 'Yes', icon: 'fullscreen' },
  ];

  protected readonly boolOptions = [
    { value: 'false', label: 'Off' },
    { value: 'true', label: 'On' },
  ];
}
