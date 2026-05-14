import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AvatarSize, AvatarShape } from './avatar.types.js';

@Component({
  selector: 'ng0-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'accessibleLabel()',
  },
  templateUrl: './avatar.component.html',
})
export class Ng0AvatarComponent {
  readonly src = input<string>();
  readonly alt = input<string>('');
  readonly name = input<string | undefined>('');
  readonly size = input<AvatarSize>('md');
  readonly shape = input<AvatarShape>('circle');
  readonly ariaLabel = input<string>();

  readonly initials = computed(() => {
    const fullName = this.name();
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  });

  readonly accessibleLabel = computed(() => {
    return this.ariaLabel() || this.name() || this.alt() || 'User avatar';
  });

  protected readonly containerClasses = computed(() => {
    const sizes: Record<AvatarSize, string> = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-14 h-14 text-lg',
      xl: 'w-20 h-20 text-xl',
    };

    const shapes: Record<AvatarShape, string> = {
      circle: 'rounded-full',
      square: 'rounded-none',
      rounded: 'rounded-lg',
    };

    const bgColors = [
      'bg-primary',
      'bg-success',
      'bg-warning',
      'bg-error',
      'bg-info',
    ];
    const name = this.name();
    let bgColor = bgColors[0];
    if (name) {
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      bgColor = bgColors[Math.abs(hash) % bgColors.length];
    }

    return `inline-flex items-center justify-center overflow-hidden text-primary-content ${sizes[this.size()]} ${shapes[this.shape()]} ${this.src() ? '' : bgColor}`;
  });

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
