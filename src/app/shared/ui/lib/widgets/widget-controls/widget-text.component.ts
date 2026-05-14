import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ng0-widget-text',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './widget-text.component.html',
  host: { class: 'flex-1 min-w-0' },
})
export class WidgetTextComponent {
  readonly value = input<string>('');
  readonly placeholder = input<string>('');
  readonly type = input<'text' | 'url' | 'email' | 'number'>('text');
  readonly valueChange = output<string>();

  protected onChange(value: string): void {
    this.valueChange.emit(value);
  }
}
