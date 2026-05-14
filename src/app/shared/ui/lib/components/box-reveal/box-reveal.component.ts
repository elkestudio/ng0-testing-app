import {
  Component,
  input,
  effect,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'ng0-box-reveal',
  standalone: true,
  imports: [],
  template: `
    <div class="relative inline-block overflow-hidden">
      <div
        class="transition-opacity duration-0"
        [style.opacity]="isContentVisible() ? 1 : 0"
      >
        <ng-content></ng-content>
      </div>
      <div
        class="absolute inset-0 z-10 pointer-events-none"
        [style.background-color]="boxColor()"
        [style.transform-origin]="transformOrigin()"
        [style.transform]="boxTransform()"
        [style.transition]="boxTransition()"
      ></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ng0BoxRevealComponent {
  readonly toggled = input<boolean>(false);
  readonly boxColor = input<string>('var(--color-primary, #000)');
  readonly duration = input<number>(0.5);
  readonly timeout = input<number>(0);
  readonly direction = input<'ltr' | 'rtl' | 'ttb' | 'btt'>('ltr');

  private readonly animationState = signal<'idle' | 'in' | 'visible' | 'out'>('idle');

  readonly isContentVisible = computed(() => {
    const state = this.animationState();
    return state === 'visible' || state === 'out';
  });

  readonly boxTransform = computed(() => {
    const state = this.animationState();
    const dir = this.direction();
    const isVertical = dir === 'ttb' || dir === 'btt';
    const val = state === 'in' || state === 'visible' ? 1 : 0;
    return isVertical ? `scaleY(${val})` : `scaleX(${val})`;
  });

  readonly transformOrigin = computed(() => {
    const dir = this.direction();
    const isOut = this.animationState() === 'out';
    switch (dir) {
      case 'ltr': return isOut ? '100% 50%' : '0% 50%';
      case 'rtl': return isOut ? '0% 50%' : '100% 50%';
      case 'ttb': return isOut ? '50% 100%' : '50% 0%';
      case 'btt': return isOut ? '50% 0%' : '50% 100%';
      default: return '0% 50%';
    }
  });

  readonly boxTransition = computed(() => {
    if (this.animationState() === 'idle') return 'none';
    return `transform ${this.duration()}s cubic-bezier(0.77, 0, 0.175, 1)`;
  });

  constructor() {
    effect(() => {
      if (this.toggled()) {
        this.playReveal();
      } else {
        this.animationState.set('idle');
      }
    });
  }

  private async playReveal(): Promise<void> {
    this.animationState.set('idle');
    if (this.timeout() > 0) {
      await new Promise((r) => setTimeout(r, this.timeout()));
    }
    await new Promise((r) => setTimeout(r, 0));
    this.animationState.set('in');
    await new Promise((r) => setTimeout(r, this.duration() * 1000));
    this.animationState.set('visible');
    this.animationState.set('out');
  }
}
