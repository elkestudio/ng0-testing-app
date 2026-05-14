import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetSelectComponent, WidgetTextComponent, WidgetRowComponent } from '../widget-controls/index';
import type { ImagePropsChange } from '../widget-prop-types';

@Component({
  selector: 'ng0-image-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetSelectComponent, WidgetTextComponent],
  templateUrl: './image-props-widget.component.html',
})
export class ImagePropsWidgetComponent {
  readonly src = input<string>('');
  readonly alt = input<string>('');
  readonly objectFit = input<string>('cover');
  readonly changed = output<ImagePropsChange>();

  protected readonly fitOptions = [
    { value: 'cover', label: 'Cover' },
    { value: 'contain', label: 'Contain' },
    { value: 'fill', label: 'Fill' },
    { value: 'none', label: 'None' },
    { value: 'scale-down', label: 'Scale Down' },
  ];
}
