import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WidgetButtonGroupComponent, SIZE_OPTIONS_4, WIDTH_PRESET_OPTIONS } from '../widget-controls/index';
import { ColorWidgetComponent, type ColorChange } from '../color-widget/color-widget.component';
import { Ng0IconComponent } from '../../components/icon/icon.component';
import type { ButtonPropsChange } from '../widget-prop-types';
import type { TextStyleChange } from '../text-style-widget/text-style-widget.component';

/** CSS variable → variant mapping for resolving theme colors */
const VARIANT_CSS_VARS: Record<string, { bg: string; text: string }> = {
  primary: { bg: '--color-primary', text: '--color-primary-content' },
  secondary: { bg: '--color-secondary', text: '--color-secondary-content' },
  accent: { bg: '--color-accent', text: '--color-accent-content' },
  neutral: { bg: '--color-neutral', text: '--color-neutral-content' },
  ghost: { bg: '--color-base-100', text: '--color-base-content' },
  link: { bg: '--color-base-100', text: '--color-primary' },
};

@Component({
  selector: 'ng0-button-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, WidgetButtonGroupComponent, ColorWidgetComponent, Ng0IconComponent],
  templateUrl: './button-props-widget.component.html',
  host: { 'class': 'block relative' },
})
export class ButtonPropsWidgetComponent {
  private readonly elRef = inject(ElementRef);

  readonly variant = input<string>('primary');
  readonly size = input<string>('md');
  readonly btnWidth = input<string>('fit');
  readonly shape = input<string>('rounded');
  readonly icon = input<string>('');
  readonly iconOnly = input<boolean>(false);
  readonly iconPosition = input<string>('start');
  readonly backgroundColor = input<string>('');
  readonly color = input<string>('');
  readonly backgroundImage = input<string>('');
  readonly label = input<string>('');
  readonly fontWeight = input<string>('500');
  readonly textAlign = input<string>('center');
  readonly fontStyle = input<string>('normal');
  readonly textDecoration = input<string>('none');
  readonly letterSpacing = input<string>('');
  readonly textTransform = input<string>('none');
  readonly justifyContent = input<string>('center');
  readonly alignItems = input<string>('center');
  readonly changed = output<ButtonPropsChange>();
  readonly colorChanged = output<ColorChange>();
  readonly textStyleChanged = output<TextStyleChange>();

  protected readonly showColorPicker = signal(false);
  protected readonly copied = signal(false);

  /** Force recompute after variant change so getComputedStyle picks up new theme */
  private readonly tick = signal(0);

  protected readonly colorInfoText = computed(() => {
    this.tick();
    const v = this.variant();
    if (v === 'custom') {
      const bgImg = this.backgroundImage();
      if (bgImg) {
        // Extract hex colors from gradient string
        const hexMatches = bgImg.match(/#[0-9a-fA-F]{6}/g);
        if (hexMatches && hexMatches.length >= 2) {
          const type = bgImg.startsWith('radial') ? 'radial' : 'linear';
          return `${type}: ${hexMatches[0]} → ${hexMatches[hexMatches.length - 1]}`;
        }
      }
      const bg = this.backgroundColor();
      return bg ? this.toHex(bg) : '';
    }
    const vars = VARIANT_CSS_VARS[v];
    if (!vars) return '';
    const el = this.elRef.nativeElement as HTMLElement;
    const styles = getComputedStyle(el);
    const bg = styles.getPropertyValue(vars.bg).trim();
    const text = styles.getPropertyValue(vars.text).trim();
    const bgHex = this.toHex(bg);
    const textHex = this.toHex(text);
    if (v === 'ghost' || v === 'link') {
      return `${bgHex} · ${textHex}`;
    }
    return bgHex;
  });

  protected readonly colorVariants = [
    { value: 'primary', label: 'Primary', color: 'var(--color-primary)' },
    { value: 'secondary', label: 'Secondary', color: 'var(--color-secondary)' },
    { value: 'accent', label: 'Accent', color: 'var(--color-accent)' },
    { value: 'neutral', label: 'Neutral', color: 'var(--color-neutral)' },
  ];

  protected readonly extraVariants = [
    { value: 'ghost', label: 'Ghost' },
    { value: 'link', label: 'Link' },
  ];

  protected readonly shapeIcons = [
    { value: 'rounded', label: 'Rounded', svg: { x: 2, y: 4, w: 12, h: 8, rx: 3 } },
    { value: 'pill', label: 'Pill', svg: { x: 2, y: 4, w: 12, h: 8, rx: 4 } },
    { value: 'square', label: 'Square', svg: { x: 2, y: 4, w: 12, h: 8, rx: 0 } },
    { value: 'circle', label: 'Circle', svg: { x: 3, y: 3, w: 10, h: 10, rx: 5 } },
  ];

  protected readonly sizeOptions = SIZE_OPTIONS_4;
  protected readonly widthOptions = WIDTH_PRESET_OPTIONS;

  protected readonly transformOptions = [
    { value: 'none', label: 'Aa' },
    { value: 'uppercase', label: 'AA' },
    { value: 'capitalize', label: 'Aa' },
    { value: 'lowercase', label: 'aa' },
  ];

  protected readonly weightButtons: { value: string; icon: string; label: string }[] = [
    { value: 'normal', icon: 'format_clear', label: 'Normal' },
    { value: 'bold', icon: 'format_bold', label: 'Bold' },
  ];

  protected readonly justifyOptions: { value: string; icon: string; label: string }[] = [
    { value: 'flex-start', icon: 'format_align_left', label: 'Start' },
    { value: 'center', icon: 'format_align_center', label: 'Center' },
    { value: 'flex-end', icon: 'format_align_right', label: 'End' },
  ];

  protected readonly alignOptions: { value: string; icon: string; label: string }[] = [
    { value: 'flex-start', icon: 'align_vertical_top', label: 'Top' },
    { value: 'center', icon: 'align_vertical_center', label: 'Center' },
    { value: 'flex-end', icon: 'align_vertical_bottom', label: 'Bottom' },
    { value: 'stretch', icon: 'vertical_distribute', label: 'Stretch' },
  ];

  protected selectCustom(): void {
    this.changed.emit({ variant: 'custom' });
    this.showColorPicker.set(true);
  }

  protected selectPreset(value: string): void {
    this.showColorPicker.set(false);
    this.changed.emit({ variant: value });
    this.colorChanged.emit({ backgroundColor: '', color: '' });
    this.tick.update(n => n + 1);
  }

  protected toggleColorPicker(): void {
    this.showColorPicker.update(v => !v);
  }

  protected onColorPicked(change: ColorChange): void {
    if (change.backgroundImage) {
      // Gradient — emit as-is, keep existing text color
      this.colorChanged.emit(change);
    } else if (change.backgroundColor) {
      const textColor = this.contrastText(change.backgroundColor);
      this.colorChanged.emit({ ...change, color: textColor });
    } else {
      this.colorChanged.emit(change);
    }
    this.tick.update(n => n + 1);
  }

  protected copyColor(): void {
    const text = this.colorInfoText();
    if (text) {
      navigator.clipboard.writeText(text);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1200);
    }
  }

  private toHex(color: string): string {
    if (!color) return '';
    if (color.startsWith('#')) return color.toLowerCase();
    const m = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (m) {
      const r = (+m[1]).toString(16).padStart(2, '0');
      const g = (+m[2]).toString(16).padStart(2, '0');
      const b = (+m[3]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
    return color;
  }

  private contrastText(bg: string): string {
    const m = bg.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (m) {
      const lum = 0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3];
      return lum > 128 ? '#000000' : '#ffffff';
    }
    const hex = bg.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      return lum > 128 ? '#000000' : '#ffffff';
    }
    return '#ffffff';
  }
}
