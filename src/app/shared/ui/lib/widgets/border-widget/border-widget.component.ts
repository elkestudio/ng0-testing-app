import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  computed,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface BorderChange {
  // Shorthand (applied when 'all' is active)
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string;
  // Per-side
  borderTopWidth?: string; borderRightWidth?: string; borderBottomWidth?: string; borderLeftWidth?: string;
  borderTopStyle?: string; borderRightStyle?: string; borderBottomStyle?: string; borderLeftStyle?: string;
  borderTopColor?: string; borderRightColor?: string; borderBottomColor?: string; borderLeftColor?: string;
  // Per-corner radius
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomRightRadius?: string;
  borderBottomLeftRadius?: string;
  // Outline
  outlineWidth?: string;
  outlineStyle?: string;
  outlineColor?: string;
  outlineOffset?: string;
}

type Side = 'all' | 'top' | 'right' | 'bottom' | 'left';
type Corner = 'all' | 'tl' | 'tr' | 'br' | 'bl';

@Component({
  selector: 'ng0-border-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './border-widget.component.html',
})
export class BorderWidgetComponent {
  readonly borderWidth = input<string>('');
  readonly borderStyle = input<string>('none');
  readonly borderColor = input<string>('');
  readonly borderRadius = input<string>('');
  readonly outlineWidth = input<string>('');
  readonly outlineStyle = input<string>('none');
  readonly outlineColor = input<string>('');
  readonly outlineOffset = input<string>('');
  // Per-side/per-corner values for inferring linked state from the element
  readonly borderTopWidth = input<string>('');
  readonly borderRightWidth = input<string>('');
  readonly borderBottomWidth = input<string>('');
  readonly borderLeftWidth = input<string>('');
  readonly borderTopLeftRadius = input<string>('');
  readonly borderTopRightRadius = input<string>('');
  readonly borderBottomRightRadius = input<string>('');
  readonly borderBottomLeftRadius = input<string>('');

  readonly changed = output<BorderChange>();

  /** Currently-focused side for width/color/style edits. 'all' = shorthand. */
  protected readonly activeSide = signal<Side>('all');
  /** Currently-focused corner for radius edits. 'all' = shorthand. */
  protected readonly activeCorner = signal<Corner>('all');

  /** Inferred: unlinked when any per-side value diverges from the rest. */
  private readonly inferredLinked = computed(() => {
    const t = this.borderTopWidth(), r = this.borderRightWidth(), b = this.borderBottomWidth(), l = this.borderLeftWidth();
    if (!t && !r && !b && !l) return true;
    return t === r && r === b && b === l;
  });
  private readonly inferredCornersLinked = computed(() => {
    const tl = this.borderTopLeftRadius(), tr = this.borderTopRightRadius(),
      br = this.borderBottomRightRadius(), bl = this.borderBottomLeftRadius();
    if (!tl && !tr && !br && !bl) return true;
    return tl === tr && tr === br && br === bl;
  });
  private readonly linkedOverride = signal<boolean | null>(null);
  private readonly cornersLinkedOverride = signal<boolean | null>(null);
  /** Linked vs unlinked: when linked, side edits apply as shorthand. */
  protected readonly linked = computed(() => this.linkedOverride() ?? this.inferredLinked());
  /** Corners linked: when true, editing any corner updates all four. */
  protected readonly cornersLinked = computed(() => this.cornersLinkedOverride() ?? this.inferredCornersLinked());

  protected toggleCornersLinked(): void {
    this.cornersLinkedOverride.set(!this.cornersLinked());
    if (this.cornersLinked()) this.activeCorner.set('all');
  }

  protected readonly borderStyleButtons = [
    { value: 'none', label: 'None', icon: 'block' },
    { value: 'solid', label: 'Solid', icon: 'horizontal_rule' },
    { value: 'dashed', label: 'Dashed', icon: 'pen_size_3' },
    { value: 'dotted', label: 'Dotted', icon: 'more_horiz' },
  ];

  protected readonly outlineStyleButtons = this.borderStyleButtons;

  protected readonly corners: { id: Exclude<Corner, 'all'>; label: string }[] = [
    { id: 'tl', label: 'Top-left' },
    { id: 'tr', label: 'Top-right' },
    { id: 'br', label: 'Bottom-right' },
    { id: 'bl', label: 'Bottom-left' },
  ];

  protected readonly activeLabel = computed(() => {
    if (this.activeCorner() !== 'all') {
      return { tl: 'Top-left', tr: 'Top-right', br: 'Bottom-right', bl: 'Bottom-left' }[this.activeCorner() as Exclude<Corner, 'all'>];
    }
    if (this.activeSide() !== 'all') {
      const s = this.activeSide();
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
    return 'All';
  });

  protected setActiveSide(side: Side): void {
    this.activeSide.set(side);
    this.activeCorner.set('all');
  }

  protected setActiveCorner(corner: Corner): void {
    this.activeCorner.set(corner);
    this.activeSide.set('all');
  }

  protected resetActive(): void {
    this.activeSide.set('all');
    this.activeCorner.set('all');
  }

  protected toggleLinked(): void {
    this.linkedOverride.set(!this.linked());
    if (!this.linked()) {
      // Unlinking: seed per-side with the shorthand value so edits start from a known state
      const w = this.borderWidth() || '0px';
      const s = this.borderStyle() || 'solid';
      const c = this.borderColor() || '';
      this.changed.emit({
        borderTopWidth: w, borderRightWidth: w, borderBottomWidth: w, borderLeftWidth: w,
        borderTopStyle: s, borderRightStyle: s, borderBottomStyle: s, borderLeftStyle: s,
        borderTopColor: c, borderRightColor: c, borderBottomColor: c, borderLeftColor: c,
      });
    } else {
      this.resetActive();
    }
  }

  // ── Border style ─────────────────────────────────────
  protected setBorderStyle(value: string): void {
    const side = this.activeSide();
    if (!this.linked() && side !== 'all') {
      this.changed.emit({ [`border${this.cap(side)}Style`]: value } as BorderChange);
    } else {
      this.changed.emit({ borderStyle: value });
    }
  }

  protected onBorderWidthChange(value: string): void {
    const side = this.activeSide();
    if (!this.linked() && side !== 'all') {
      this.changed.emit({ [`border${this.cap(side)}Width`]: value } as BorderChange);
    } else {
      this.changed.emit({ borderWidth: value });
    }
  }

  protected onBorderColorChange(value: string): void {
    const side = this.activeSide();
    if (!this.linked() && side !== 'all') {
      this.changed.emit({ [`border${this.cap(side)}Color`]: value } as BorderChange);
    } else {
      this.changed.emit({ borderColor: value });
    }
  }

  // ── Radius dragging from corner dot ──────────────────
  /**
   * Start a pointer drag on a corner dot. Vertical drag up → increase radius,
   * drag down → decrease. Emits continuously so the widget diagram and the
   * element update live.
   */
  protected onCornerPointerDown(event: PointerEvent, corner: Exclude<Corner, 'all'>): void {
    event.stopPropagation();
    event.preventDefault();
    this.setActiveCorner(corner);

    const startY = event.clientY;
    const startRadius = this.parsePxRadius(this.radiusForCorner(corner));

    const onMove = (e: PointerEvent) => {
      const dy = startY - e.clientY;
      const next = Math.max(0, Math.min(200, Math.round(startRadius + dy)));
      this.onBorderRadiusChange(`${next}px`);
    };
    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }

  /** Current radius for the given corner (falls back to shorthand). */
  private radiusForCorner(corner: Exclude<Corner, 'all'>): string {
    return this.borderRadius() || '0px';
  }

  /** Parse a CSS radius string to pixel number — converts rem to px at 16px/rem. */
  private parsePxRadius(raw: string): number {
    const m = /^(-?\d*\.?\d+)(px|rem)?$/.exec((raw ?? '').trim());
    if (!m) return 0;
    const n = parseFloat(m[1]);
    return (m[2] ?? 'px') === 'rem' ? n * 16 : n;
  }

  // ── Radius ───────────────────────────────────────────
  protected onBorderRadiusChange(value: string): void {
    const corner = this.activeCorner();
    if (this.cornersLinked() || corner === 'all') {
      this.changed.emit({ borderRadius: value });
      return;
    }
    const map: Record<Exclude<Corner, 'all'>, keyof BorderChange> = {
      tl: 'borderTopLeftRadius',
      tr: 'borderTopRightRadius',
      br: 'borderBottomRightRadius',
      bl: 'borderBottomLeftRadius',
    };
    this.changed.emit({ [map[corner]]: value } as BorderChange);
  }

  // ── Outline (unchanged per-all semantics) ────────────
  protected setOutlineStyle(value: string): void { this.changed.emit({ outlineStyle: value }); }
  protected onOutlineWidthChange(value: string): void { this.changed.emit({ outlineWidth: value }); }
  protected onOutlineColorChange(value: string): void { this.changed.emit({ outlineColor: value }); }
  protected onOutlineOffsetChange(value: string): void { this.changed.emit({ outlineOffset: value }); }

  private cap(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
