import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

/** Theme tokens surfaced as quick-select swatches in the color widget. */
const THEME_SWATCH_TOKENS: { label: string; cssVar: string }[] = [
  { label: 'Primary', cssVar: '--color-primary' },
  { label: 'Secondary', cssVar: '--color-secondary' },
  { label: 'Accent', cssVar: '--color-accent' },
  { label: 'Base 100', cssVar: '--color-base-100' },
  { label: 'Base 200', cssVar: '--color-base-200' },
  { label: 'Base 300', cssVar: '--color-base-300' },
  { label: 'Base content', cssVar: '--color-base-content' },
  { label: 'Base border', cssVar: '--color-base-border' },
  { label: 'Success', cssVar: '--color-success' },
  { label: 'Warning', cssVar: '--color-warning' },
  { label: 'Error', cssVar: '--color-error' },
  { label: 'Info', cssVar: '--color-info' },
];

export type ColorChannel = 'bg' | 'text';
export type FillType = 'solid' | 'linear' | 'radial';

export interface GradientStop {
  color: string;
  position: number;
}

export interface ColorChange {
  backgroundColor?: string;
  color?: string;
  backgroundImage?: string;
}

// --- Color conversion utilities ---

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  h /= 360; s /= 100; v /= 100;
  let r = 0, g = 0, b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function parseColor(color: string): { h: number; s: number; v: number; a: number } {
  if (!color || color === 'transparent' || color === 'inherit') return { h: 0, s: 0, v: 0, a: 1 };
  const rgbaMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\)/);
  if (rgbaMatch) {
    const [h, s, v] = rgbToHsv(+rgbaMatch[1], +rgbaMatch[2], +rgbaMatch[3]);
    return { h, s, v, a: rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1 };
  }
  const rgb = hexToRgb(color);
  if (rgb) {
    const [h, s, v] = rgbToHsv(...rgb);
    return { h, s, v, a: 1 };
  }
  return { h: 0, s: 0, v: 100, a: 1 };
}

@Component({
  selector: 'ng0-color-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './color-widget.component.html',
})
export class ColorWidgetComponent {
  readonly backgroundColor = input<string>('');
  readonly color = input<string>('');
  readonly channel = input<ColorChannel>('bg');
  readonly backgroundImage = input<string>('');

  readonly changed = output<ColorChange>();

  private initialized = false;
  private readonly hostRef = inject(ElementRef<HTMLElement>);
  /** Forces the theme swatches to re-read computed CSS vars when themes change. */
  protected readonly themeTick = signal(0);

  protected readonly themeSwatches = computed(() => {
    this.themeTick();
    const host = this.hostRef.nativeElement;
    const styles = getComputedStyle(host);
    return THEME_SWATCH_TOKENS.map(t => ({
      label: t.label,
      hex: this.resolveTokenHex(styles.getPropertyValue(t.cssVar).trim()),
    })).filter(s => !!s.hex);
  });

  protected pickThemeSwatch(hex: string): void {
    this.onHexInput(hex);
  }

  private resolveTokenHex(raw: string): string {
    if (!raw) return '';
    if (raw.startsWith('#')) return raw.toLowerCase();
    const m = raw.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (m) {
      const r = (+m[1]).toString(16).padStart(2, '0');
      const g = (+m[2]).toString(16).padStart(2, '0');
      const b = (+m[3]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
    return raw;
  }

  // Internal state
  protected readonly fillType = signal<FillType>('solid');
  protected readonly hue = signal(0);
  protected readonly saturation = signal(100);
  protected readonly brightness = signal(100);
  protected readonly alpha = signal(1);
  protected readonly gradientAngle = signal(90);
  protected readonly gradientStops = signal<GradientStop[]>([
    { color: '#ffffff', position: 0 },
    { color: '#000000', position: 100 },
  ]);
  protected readonly activeStopIndex = signal(0);

  private dragging = false;

  // Computed values
  protected readonly currentRgb = computed(() => hsvToRgb(this.hue(), this.saturation(), this.brightness()));
  protected readonly currentHex = computed(() => rgbToHex(...this.currentRgb()));
  protected readonly hexDisplay = computed(() => this.currentHex().replace('#', ''));
  protected readonly alphaPercent = computed(() => Math.round(this.alpha() * 100));
  protected readonly hueColor = computed(() => `hsl(${this.hue()}, 100%, 50%)`);

  protected readonly panelGradient = computed(() =>
    `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${this.hue()}, 100%, 50%))`
  );

  protected readonly alphaGradient = computed(() => {
    const hex = this.currentHex();
    return `linear-gradient(to right, transparent, ${hex})`;
  });

  protected readonly colorPreview = computed(() => {
    const [r, g, b] = this.currentRgb();
    return `rgba(${r}, ${g}, ${b}, ${this.alpha()})`;
  });

  protected readonly gradientPreview = computed(() => {
    const stops = this.gradientStops().map(s => `${s.color} ${s.position}%`).join(', ');
    return this.fillType() === 'linear'
      ? `linear-gradient(${this.gradientAngle()}deg, ${stops})`
      : `radial-gradient(circle, ${stops})`;
  });

  constructor() {
    // On first render, parse backgroundImage to restore gradient state
    effect(() => {
      const bgImg = this.backgroundImage();
      const channel = this.channel();
      const bgColor = this.backgroundColor();
      const textColor = this.color();

      if (!this.initialized) {
        untracked(() => {
          this.initialized = true;
          if (bgImg && channel === 'bg') {
            const parsed = parseGradientString(bgImg);
            if (parsed) {
              this.fillType.set(parsed.type);
              this.gradientAngle.set(parsed.angle);
              this.gradientStops.set(parsed.stops);
              this.activeStopIndex.set(0);
              const firstStop = parsed.stops[0];
              if (firstStop) {
                const c = parseColor(firstStop.color);
                this.hue.set(c.h);
                this.saturation.set(c.s);
                this.brightness.set(c.v);
                this.alpha.set(c.a);
              }
              return;
            }
          }
          // Solid color init
          const raw = channel === 'bg' ? bgColor : textColor;
          const c = parseColor(raw);
          this.hue.set(c.h);
          this.saturation.set(c.s);
          this.brightness.set(c.v);
          this.alpha.set(c.a);
        });
        return;
      }

      // Subsequent updates: sync solid color (not while dragging)
      if (!this.dragging) {
        const raw = channel === 'bg' ? bgColor : textColor;
        const parsed = parseColor(raw);
        untracked(() => {
          this.hue.set(parsed.h);
          this.saturation.set(parsed.s);
          this.brightness.set(parsed.v);
          this.alpha.set(parsed.a);
        });
      }
    });
  }

  // --- Sat/brightness panel ---
  protected onPanelDown(e: PointerEvent): void {
    this.dragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.updatePanel(e);
  }

  protected onPanelMove(e: PointerEvent): void {
    if (!this.dragging) return;
    this.updatePanel(e);
  }

  protected onPanelUp(): void {
    this.dragging = false;
  }

  private updatePanel(e: PointerEvent): void {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const s = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const v = Math.max(0, Math.min(100, (1 - (e.clientY - rect.top) / rect.height) * 100));
    this.saturation.set(Math.round(s));
    this.brightness.set(Math.round(v));
    this.emitColor();
  }

  // --- Hue slider ---
  protected onHueDown(e: PointerEvent): void {
    this.dragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.updateHue(e);
  }

  protected onHueMove(e: PointerEvent): void {
    if (!this.dragging) return;
    this.updateHue(e);
  }

  protected onHueUp(): void {
    this.dragging = false;
  }

  private updateHue(e: PointerEvent): void {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const h = Math.max(0, Math.min(360, ((e.clientX - rect.left) / rect.width) * 360));
    this.hue.set(Math.round(h));
    this.emitColor();
  }

  // --- Alpha slider ---
  protected onAlphaDown(e: PointerEvent): void {
    this.dragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.updateAlpha(e);
  }

  protected onAlphaMove(e: PointerEvent): void {
    if (!this.dragging) return;
    this.updateAlpha(e);
  }

  protected onAlphaUp(): void {
    this.dragging = false;
  }

  private updateAlpha(e: PointerEvent): void {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const a = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this.alpha.set(Math.round(a * 100) / 100);
    this.emitColor();
  }

  /** Native EyeDropper API availability — guards the UI button. */
  protected readonly eyeDropperSupported = typeof (globalThis as unknown as { EyeDropper?: unknown }).EyeDropper === 'function';

  /** Pick a color from anywhere on screen via the browser EyeDropper API. */
  protected async pickFromScreen(): Promise<void> {
    const EyeDropperCtor = (globalThis as unknown as {
      EyeDropper?: new () => { open(): Promise<{ sRGBHex: string }> };
    }).EyeDropper;
    if (!EyeDropperCtor) return;
    try {
      const result = await new EyeDropperCtor().open();
      this.onHexInput(result.sRGBHex);
    } catch {
      /* user cancelled */
    }
  }

  // --- Text inputs ---
  protected onHexInput(value: string): void {
    const hex = value.startsWith('#') ? value : '#' + value;
    const rgb = hexToRgb(hex);
    if (rgb) {
      const [h, s, v] = rgbToHsv(...rgb);
      this.hue.set(h);
      this.saturation.set(s);
      this.brightness.set(v);
      this.emitColor();
    }
  }

  protected onAlphaInput(value: string): void {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      this.alpha.set(Math.max(0, Math.min(1, num / 100)));
      this.emitColor();
    }
  }

  // --- Channel / fill type ---
  protected setFillType(type: FillType): void {
    this.fillType.set(type);
    if (type === 'solid') {
      // Switching back to solid — clear gradient and emit solid color
      const [r, g, b] = this.currentRgb();
      const a = this.alpha();
      const value = a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : this.currentHex();
      if (this.channel() === 'bg') {
        this.changed.emit({ backgroundColor: value, backgroundImage: '' });
      } else {
        this.changed.emit({ color: value });
      }
    } else {
      // Initialize gradient stops from current color
      this.gradientStops.set([
        { color: this.currentHex(), position: 0 },
        { color: '#000000', position: 100 },
      ]);
      this.activeStopIndex.set(0);
      this.emitGradient();
    }
  }

  // --- Gradient controls ---
  protected onAngleDown(e: PointerEvent): void {
    this.dragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this.updateAngle(e);
  }

  protected onAngleMove(e: PointerEvent): void {
    if (!this.dragging) return;
    this.updateAngle(e);
  }

  protected onAngleUp(): void {
    this.dragging = false;
  }

  private updateAngle(e: PointerEvent): void {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const a = Math.max(0, Math.min(360, ((e.clientX - rect.left) / rect.width) * 360));
    this.gradientAngle.set(Math.round(a));
    this.emitGradient();
  }

  protected selectStop(index: number): void {
    this.activeStopIndex.set(index);
    const stop = this.gradientStops()[index];
    if (stop) {
      const parsed = parseColor(stop.color);
      this.hue.set(parsed.h);
      this.saturation.set(parsed.s);
      this.brightness.set(parsed.v);
      this.alpha.set(parsed.a);
    }
  }

  /** Click on gradient bar to add a new stop at that position */
  protected onBarClick(e: PointerEvent): void {
    // Ignore if click was on a stop handle (handled by onStopDown)
    if ((e.target as HTMLElement).closest('[data-stop]')) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const pos = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const stops = [...this.gradientStops()];
    // Interpolate color from neighboring stops
    const newColor = this.interpolateColorAt(pos, stops);
    stops.push({ color: newColor, position: pos });
    stops.sort((a, b) => a.position - b.position);
    const newIdx = stops.findIndex(s => s.position === pos && s.color === newColor);
    this.gradientStops.set(stops);
    this.activeStopIndex.set(newIdx);
    const parsed = parseColor(newColor);
    this.hue.set(parsed.h);
    this.saturation.set(parsed.s);
    this.brightness.set(parsed.v);
    this.alpha.set(parsed.a);
    this.emitGradient();
  }

  /** Remove a gradient stop (min 2 stops required) */
  protected removeStop(index: number): void {
    const stops = this.gradientStops();
    if (stops.length <= 2) return;
    const newStops = stops.filter((_, i) => i !== index);
    this.gradientStops.set(newStops);
    const newIdx = Math.min(this.activeStopIndex(), newStops.length - 1);
    this.activeStopIndex.set(newIdx);
    const stop = newStops[newIdx];
    if (stop) {
      const parsed = parseColor(stop.color);
      this.hue.set(parsed.h);
      this.saturation.set(parsed.s);
      this.brightness.set(parsed.v);
      this.alpha.set(parsed.a);
    }
    this.emitGradient();
  }

  private interpolateColorAt(pos: number, stops: GradientStop[]): string {
    if (stops.length < 2) return '#808080';
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    // Find the two surrounding stops
    let left = sorted[0];
    let right = sorted[sorted.length - 1];
    for (let i = 0; i < sorted.length - 1; i++) {
      if (pos >= sorted[i].position && pos <= sorted[i + 1].position) {
        left = sorted[i];
        right = sorted[i + 1];
        break;
      }
    }
    if (left.position === right.position) return left.color;
    const t = (pos - left.position) / (right.position - left.position);
    const lParsed = parseColor(left.color);
    const rParsed = parseColor(right.color);
    const lRgb = hsvToRgb(lParsed.h, lParsed.s, lParsed.v);
    const rRgb = hsvToRgb(rParsed.h, rParsed.s, rParsed.v);
    const r = Math.round(lRgb[0] + (rRgb[0] - lRgb[0]) * t);
    const g = Math.round(lRgb[1] + (rRgb[1] - lRgb[1]) * t);
    const b = Math.round(lRgb[2] + (rRgb[2] - lRgb[2]) * t);
    const a = Math.round((lParsed.a + (rParsed.a - lParsed.a) * t) * 100) / 100;
    return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : rgbToHex(r, g, b);
  }

  protected onStopDown(e: PointerEvent, index: number): void {
    e.stopPropagation();
    this.activeStopIndex.set(index);
    const stop = this.gradientStops()[index];
    if (stop) {
      const parsed = parseColor(stop.color);
      this.hue.set(parsed.h);
      this.saturation.set(parsed.s);
      this.brightness.set(parsed.v);
      this.alpha.set(parsed.a);
    }
    this.dragging = true;
    const bar = (e.currentTarget as HTMLElement).parentElement!;
    const onMove = (me: PointerEvent) => {
      const rect = bar.getBoundingClientRect();
      const pos = Math.max(0, Math.min(100, ((me.clientX - rect.left) / rect.width) * 100));
      const stops = [...this.gradientStops()];
      stops[index] = { ...stops[index], position: Math.round(pos) };
      this.gradientStops.set(stops);
      this.emitGradient();
    };
    const onUp = () => {
      this.dragging = false;
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }

  /** Build an rgba or hex color string from the current HSV + alpha state */
  private currentColorString(): string {
    const [r, g, b] = this.currentRgb();
    const a = this.alpha();
    return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : this.currentHex();
  }

  // --- Emit ---
  private emitColor(): void {
    const fillType = this.fillType();
    if (fillType !== 'solid' && this.channel() === 'bg') {
      // Update the active gradient stop color (includes alpha)
      const stops = [...this.gradientStops()];
      const idx = this.activeStopIndex();
      stops[idx] = { ...stops[idx], color: this.currentColorString() };
      this.gradientStops.set(stops);
      this.emitGradient();
      return;
    }

    const [r, g, b] = this.currentRgb();
    const a = this.alpha();
    const value = a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : this.currentHex();
    if (this.channel() === 'bg') {
      this.changed.emit({ backgroundColor: value });
    } else {
      this.changed.emit({ color: value });
    }
  }

  /** Clear the active channel — emits empty string for the affected style key. */
  protected clearColor(): void {
    if (this.channel() === 'bg') {
      this.changed.emit({ backgroundColor: '', backgroundImage: '' });
    } else {
      this.changed.emit({ color: '' });
    }
  }

  private emitGradient(): void {
    const stops = this.gradientStops().map(s => `${s.color} ${s.position}%`).join(', ');
    const gradient = this.fillType() === 'linear'
      ? `linear-gradient(${this.gradientAngle()}deg, ${stops})`
      : `radial-gradient(circle, ${stops})`;
    this.changed.emit({
      backgroundImage: gradient,
      backgroundColor: 'transparent',
    });
  }
}

/** Parse a CSS gradient string into type, angle, and stops */
function parseGradientString(str: string): { type: FillType; angle: number; stops: GradientStop[] } | null {
  if (!str) return null;
  const isLinear = str.startsWith('linear-gradient');
  const isRadial = str.startsWith('radial-gradient');
  if (!isLinear && !isRadial) return null;

  const inner = str.match(/\((.+)\)/s)?.[1];
  if (!inner) return null;

  let angle = 90;
  let stopsStr = inner;

  if (isLinear) {
    const angleMatch = inner.match(/^(\d+)deg\s*,\s*/);
    if (angleMatch) {
      angle = parseInt(angleMatch[1], 10);
      stopsStr = inner.slice(angleMatch[0].length);
    }
  } else {
    // radial: skip "circle," or "ellipse," prefix
    const radialPrefixMatch = inner.match(/^(?:circle|ellipse)\s*,\s*/);
    if (radialPrefixMatch) {
      stopsStr = inner.slice(radialPrefixMatch[0].length);
    }
  }

  // Parse stops: "#hex pos%, rgba(...) pos%, ..."
  const stopRegex = /(#[0-9a-fA-F]{6}|rgba?\([^)]+\))\s+(\d+)%/g;
  const stops: GradientStop[] = [];
  let match: RegExpExecArray | null;
  while ((match = stopRegex.exec(stopsStr)) !== null) {
    const color = match[1]; // preserve rgba as-is for alpha support
    stops.push({ color, position: parseInt(match[2], 10) });
  }

  if (stops.length < 2) return null;
  return { type: isLinear ? 'linear' : 'radial', angle, stops };
}
