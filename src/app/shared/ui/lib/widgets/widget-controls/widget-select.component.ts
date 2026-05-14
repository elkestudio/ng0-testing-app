import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface WidgetSelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'ng0-widget-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './widget-select.component.html',
})
export class WidgetSelectComponent {
  readonly options = input.required<WidgetSelectOption[]>();
  readonly value = input<string>('');
  readonly label = input<string>('');
  readonly valueChange = output<string>();

  protected onChange(value: string): void {
    this.valueChange.emit(value);
  }
}
