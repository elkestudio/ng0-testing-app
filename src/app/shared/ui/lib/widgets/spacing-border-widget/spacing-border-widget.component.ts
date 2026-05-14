import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface SpacingBorderChange {
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
}

@Component({
  selector: 'ng0-spacing-border-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './spacing-border-widget.component.html',
})
export class SpacingBorderWidgetComponent {
  // Per-side inputs
  readonly marginTop = input<string>('');
  readonly marginRight = input<string>('');
  readonly marginBottom = input<string>('');
  readonly marginLeft = input<string>('');
  readonly paddingTop = input<string>('');
  readonly paddingRight = input<string>('');
  readonly paddingBottom = input<string>('');
  readonly paddingLeft = input<string>('');

  readonly changed = output<SpacingBorderChange>();

  /** Unit inferred from the currently-selected element's values (px by default). */
  private readonly inferredUnit = computed<'px' | 'rem'>(() => {
    const first = [
      this.paddingTop(), this.paddingRight(), this.paddingBottom(), this.paddingLeft(),
      this.marginTop(), this.marginRight(), this.marginBottom(), this.marginLeft(),
    ].find(v => v && v.trim());
    if (!first) return 'px';
    return /rem\s*$/i.test(first.trim()) ? 'rem' : 'px';
  });

  /** Unit override set by the user; falls back to inferred unit. */
  private readonly unitOverride = signal<'px' | 'rem' | null>(null);
  protected readonly unit = computed<'px' | 'rem'>(() => this.unitOverride() ?? this.inferredUnit());

  /** Linked state inferred from whether all four sides share the same value. */
  protected readonly paddingLinked = computed(() => {
    const a = this.paddingTop(), b = this.paddingRight(), c = this.paddingBottom(), d = this.paddingLeft();
    if (!a && !b && !c && !d) return false;
    return a === b && b === c && c === d;
  });
  protected readonly marginLinked = computed(() => {
    const a = this.marginTop(), b = this.marginRight(), c = this.marginBottom(), d = this.marginLeft();
    if (!a && !b && !c && !d) return false;
    return a === b && b === c && c === d;
  });

  /** User-forced link state toggles — when set, overrides inference. */
  private readonly paddingLinkedOverride = signal<boolean | null>(null);
  private readonly marginLinkedOverride = signal<boolean | null>(null);
  protected readonly paddingLinkedActive = computed(() => this.paddingLinkedOverride() ?? this.paddingLinked());
  protected readonly marginLinkedActive = computed(() => this.marginLinkedOverride() ?? this.marginLinked());

  protected togglePaddingLinked(): void { this.paddingLinkedOverride.set(!this.paddingLinkedActive()); }
  protected toggleMarginLinked(): void { this.marginLinkedOverride.set(!this.marginLinkedActive()); }

  /** Switching unit converts every currently-set value (1rem ↔ 16px) in one emit. */
  protected setUnit(u: 'px' | 'rem'): void {
    if (u === this.unit()) return;
    this.unitOverride.set(u);
    const sides: (keyof SpacingBorderChange)[] = [
      'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
    ];
    const currentValues: Record<string, string> = {
      paddingTop: this.paddingTop(), paddingRight: this.paddingRight(),
      paddingBottom: this.paddingBottom(), paddingLeft: this.paddingLeft(),
      marginTop: this.marginTop(), marginRight: this.marginRight(),
      marginBottom: this.marginBottom(), marginLeft: this.marginLeft(),
    };
    const change: SpacingBorderChange = {};
    for (const key of sides) {
      const converted = this.convertValue(currentValues[key], u);
      if (converted != null) (change as Record<string, string>)[key] = converted;
    }
    if (Object.keys(change).length) this.changed.emit(change);
  }

  /** Strip unit suffix for display in inputs (e.g. "1rem" → "1"). */
  protected displayValue(raw: string): string {
    if (!raw) return '';
    const m = /^(-?\d*\.?\d+)(px|rem|em|%)?$/.exec(raw.trim());
    return m ? m[1] : raw;
  }

  /** Convert a single value to the target unit; returns null if unchanged / unparseable. */
  private convertValue(raw: string, target: 'px' | 'rem'): string | null {
    if (!raw) return null;
    const m = /^(-?\d*\.?\d+)(px|rem)?$/.exec(raw.trim());
    if (!m) return null;
    const n = parseFloat(m[1]);
    const unit = (m[2] as 'px' | 'rem' | undefined) ?? target;
    if (unit === target) return null;
    const px = unit === 'rem' ? n * 16 : n;
    const out = target === 'rem' ? px / 16 : px;
    return `${+out.toFixed(4)}${target}`;
  }

  /** Append the active unit when the user types a bare numeric value. */
  private withUnit(value: string): string {
    const trimmed = (value ?? '').trim();
    if (!trimmed) return '';
    if (/^-?\d*\.?\d+$/.test(trimmed)) return trimmed + this.unit();
    return trimmed;
  }

  protected onPaddingSide(side: 'Top' | 'Right' | 'Bottom' | 'Left', value: string): void {
    const v = this.withUnit(value);
    if (this.paddingLinkedActive()) {
      this.changed.emit({ paddingTop: v, paddingRight: v, paddingBottom: v, paddingLeft: v });
    } else {
      this.changed.emit({ [`padding${side}`]: v } as SpacingBorderChange);
    }
  }

  protected onMarginSide(side: 'Top' | 'Right' | 'Bottom' | 'Left', value: string): void {
    const v = this.withUnit(value);
    if (this.marginLinkedActive()) {
      this.changed.emit({ marginTop: v, marginRight: v, marginBottom: v, marginLeft: v });
    } else {
      this.changed.emit({ [`margin${side}`]: v } as SpacingBorderChange);
    }
  }

  protected onSideChange(property: string, value: string): void {
    this.changed.emit({ [property]: value });
  }
}
