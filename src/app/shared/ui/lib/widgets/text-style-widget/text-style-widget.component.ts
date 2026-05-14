import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface TextStyleChange {
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  fontStyle?: string;
  textDecoration?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: string;
  justifyContent?: string;
  alignItems?: string;
  display?: string;
}

@Component({
  selector: 'ng0-text-style-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './text-style-widget.component.html',
})
export class TextStyleWidgetComponent {
  readonly fontSize = input<string>('');
  readonly fontWeight = input<string>('');
  readonly textAlign = input<string>('left');
  readonly fontStyle = input<string>('normal');
  readonly textDecoration = input<string>('none');
  readonly lineHeight = input<string>('');
  readonly letterSpacing = input<string>('');

  readonly changed = output<TextStyleChange>();

  protected readonly alignButtons: { value: string; icon: string; label: string }[] = [
    { value: 'left', icon: 'format_align_left', label: 'Left' },
    { value: 'center', icon: 'format_align_center', label: 'Center' },
    { value: 'right', icon: 'format_align_right', label: 'Right' },
    { value: 'justify', icon: 'format_align_justify', label: 'Justify' },
  ];

  protected readonly weightButtons: { value: string; icon: string; label: string }[] = [
    { value: 'normal', icon: 'format_clear', label: 'Normal' },
    { value: 'bold', icon: 'format_bold', label: 'Bold' },
  ];

  protected setAlign(value: string): void {
    this.changed.emit({ textAlign: value });
  }

  protected setWeight(value: string): void {
    this.changed.emit({ fontWeight: value });
  }

  protected toggleItalic(): void {
    this.changed.emit({ fontStyle: this.fontStyle() === 'italic' ? 'normal' : 'italic' });
  }

  protected toggleUnderline(): void {
    this.changed.emit({ textDecoration: this.textDecoration() === 'underline' ? 'none' : 'underline' });
  }

  protected onFontSizeChange(value: string): void {
    this.changed.emit({ fontSize: value });
  }

  protected onLineHeightChange(value: string): void {
    this.changed.emit({ lineHeight: value });
  }

  protected onLetterSpacingChange(value: string): void {
    this.changed.emit({ letterSpacing: value });
  }
}
