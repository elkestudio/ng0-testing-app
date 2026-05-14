import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { inject } from '@angular/core';
import { BUILT_IN_ICONS } from './built-in-icons';

export type IconLibrary = 'material' | 'lucide' | 'iconsax' | 'svg' | 'path';

@Component({
  selector: 'ng0-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style.font-size.px]': 'isMaterial() ? size() : undefined',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    '[style.color]': 'color()',
  },
  templateUrl: './icon.component.html',
})
export class Ng0IconComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly name = input.required<string>();
  readonly size = input<number>(24);
  readonly color = input<string>();
  readonly library = input<IconLibrary>('material');

  /** SVG node data for lucide icons: [['path', { d: '...' }], ...] */
  readonly svgNodes = input<readonly [string, Record<string, string>][]>();

  /** SVG path data for iconsax icons: ['M12 2...', ...] */
  readonly svgPaths = input<readonly string[]>();

  /** Raw SVG string for custom icons */
  readonly svgContent = input<string>();

  /** Optional base path for `library='path'` mode (default '/icons'). */
  readonly basePath = input<string>('/icons');

  readonly isMaterial = computed(() =>
    this.library() === 'material' && !BUILT_IN_ICONS[this.name()]
  );

  readonly isPath = computed(() => this.library() === 'path');

  readonly pathSrc = computed(() => {
    if (!this.isPath()) return null;
    const base = this.basePath().replace(/\/+$/, '');
    return `${base}/${this.name()}.svg`;
  });

  readonly pathLabel = computed(() => this.name() || 'icon');

  readonly hostClasses = computed(() => {
    const base = 'inline-flex items-center justify-center';
    return this.isMaterial() ? `material-symbols-outlined ${base}` : base;
  });

  readonly safeSvg = computed((): SafeHtml | null => {
    const lib = this.library();
    const s = this.size();
    const c = this.color() || 'currentColor';

    // Built-in icon: name matches registry while library is default 'material'
    if (lib === 'material') {
      const builtIn = BUILT_IN_ICONS[this.name()];
      if (builtIn) {
        const children = builtIn
          .map(d => `<path d="${d}" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`)
          .join('');
        return this.sanitizer.bypassSecurityTrustHtml(
          `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none">${children}</svg>`
        );
      }
    }

    if (lib === 'svg' && this.svgContent()) {
      return this.sanitizer.bypassSecurityTrustHtml(this.svgContent()!);
    }

    if (lib === 'lucide' && this.svgNodes()) {
      const children = this.svgNodes()!
        .map(([tag, attrs]) => {
          const a = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ');
          return `<${tag} ${a}/>`;
        })
        .join('');
      return this.sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${children}</svg>`
      );
    }

    if (lib === 'iconsax' && this.svgPaths()) {
      const children = this.svgPaths()!
        .map(d => `<path d="${d}" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`)
        .join('');
      return this.sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none">${children}</svg>`
      );
    }

    return null;
  });
}
