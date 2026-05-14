import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Ng0IconComponent } from '../icon/icon.component';
import { LinkVariant } from './link.types';

@Component({
  selector: 'ng0-link',
  standalone: true,
  imports: [RouterLink, Ng0IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './link.component.html',
})
export class Ng0LinkComponent {
  readonly href = input<string>();
  readonly routerLink = input<string | string[]>();
  readonly external = input<boolean>(false);
  readonly variant = input<LinkVariant>('default');
  readonly showExternalIcon = input<boolean>(true);

  protected readonly isExternal = computed(() => {
    if (this.external()) return true;
    const href = this.href();
    return !!href && (href.startsWith('http://') || href.startsWith('https://'));
  });

  protected readonly linkClasses = computed(() => {
    const variants: Record<LinkVariant, string> = {
      default: 'text-base-content hover:text-primary',
      primary: 'text-primary hover:text-primary/80',
      secondary: 'text-secondary hover:text-secondary/80',
      accent: 'text-accent hover:text-accent/80',
      neutral: 'text-neutral hover:text-neutral/80',
    };
    return `inline-flex items-center gap-1 underline-offset-2 hover:underline transition-colors ${variants[this.variant()]}`;
  });

  protected readonly target = computed(() => this.isExternal() ? '_blank' : undefined);
  protected readonly rel = computed(() => this.isExternal() ? 'noopener noreferrer' : undefined);
}
