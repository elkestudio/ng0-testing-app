import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'ng0-text-content',
  standalone: true,
  imports: [],
  template: `<div class="ng0-text-content" [innerHTML]="_rendered"></div>`,
  styleUrl: './text-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'onClick($event)',
  },
})
export class Ng0TextContentComponent {
  private readonly sanitizer = inject(DomSanitizer);

  @Input() set text(value: string | null | undefined) {
    this._raw = value ?? '';
    this._rendered = this.sanitizer.bypassSecurityTrustHtml(this.render(this._raw));
  }

  private _raw = '';
  _rendered: SafeHtml = '';

  onClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A') {
      event.preventDefault();
      const url = target.getAttribute('href');
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  private render(text: string): string {
    if (!text) return '';
    let safe = this.escapeHtml(text);
    safe = this.linkify(safe);
    safe = safe.replace(/\r\n|\n|\r/g, '<br>');
    return safe;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private linkify(text: string): string {
    const urlRegex = /((https?:\/\/|www\.)[^\s<]+)/gi;
    return text.replace(urlRegex, (url) => {
      const href = url.startsWith('http') ? url : 'https://' + url;
      return `<a href="${href}">${url}</a>`;
    });
  }
}
