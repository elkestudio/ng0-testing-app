import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ng0-widget-textarea',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './widget-textarea.component.html',
  host: { class: 'flex-1 min-w-0' },
})
export class WidgetTextareaComponent {
  readonly value = input<string>('');
  readonly placeholder = input<string>('');
  readonly rows = input<number>(2);
  readonly valueChange = output<string>();

  protected onChange(value: string): void {
    this.valueChange.emit(value);
  }
}
