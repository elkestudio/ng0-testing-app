import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetSelectComponent, WidgetRowComponent } from '../widget-controls/index';
import type { TextPropsChange } from '../widget-prop-types';

@Component({
  selector: 'ng0-text-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetSelectComponent],
  templateUrl: './text-props-widget.component.html',
})
export class TextPropsWidgetComponent {
  readonly variant = input<string>('body');
  readonly changed = output<TextPropsChange>();

  protected readonly variantOptions = [
    { value: 'h1', label: 'Heading 1' },
    { value: 'h2', label: 'Heading 2' },
    { value: 'h3', label: 'Heading 3' },
    { value: 'h4', label: 'Heading 4' },
    { value: 'body', label: 'Body' },
    { value: 'caption', label: 'Caption' },
    { value: 'overline', label: 'Overline' },
  ];
}
