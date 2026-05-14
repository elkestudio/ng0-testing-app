import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetRowComponent, WidgetTextComponent } from '../widget-controls/index';
import type { VideoPropsChange } from '../widget-prop-types';

@Component({
  selector: 'ng0-video-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetTextComponent],
  templateUrl: './video-props-widget.component.html',
})
export class VideoPropsWidgetComponent {
  readonly src = input<string>('');
  readonly changed = output<VideoPropsChange>();
}
