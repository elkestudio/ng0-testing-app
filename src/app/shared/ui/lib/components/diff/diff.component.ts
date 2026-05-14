import {
  Component,
  input,
  signal,
  computed,
  effect,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'ng0-diff',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="relative w-full overflow-hidden select-none grid grid-cols-1 grid-rows-1"
      [style.width]="width()"
      [style.height]="height()"
      [style.aspect-ratio]="aspectRatio() !== 'auto' ? aspectRatio() : null"
    >
      <div class="col-start-1 row-start-1 overflow-hidden">
        <ng-content select="[before]"></ng-content>
      </div>
      <div
        class="col-start-1 row-start-1 overflow-hidden z-1"
        [style.clip-path]="clipPath()"
      >
        <ng-content select="[after]"></ng-content>
      </div>
      <div
        class="absolute top-0 bottom-0 z-2 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
        [style.left.%]="internalPosition()"
      >
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white text-black shadow-lg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 9l-4 4 4 4" />
            <path d="M16 9l4 4-4 4" />
          </svg>
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        [value]="internalPosition()"
        (input)="onRangeInput($event)"
        class="absolute inset-0 w-full h-full opacity-0 z-3 cursor-ew-resize m-0 p-0 appearance-none"
        aria-label="Comparison slider"
      />
    </div>
  `,
  styles: [`ng0-diff { display: block; width: 100%; }`],
})
export class Ng0DiffComponent {
  readonly position = input<number>(50);
  readonly width = input<string>('100%');
  readonly height = input<string>('auto');
  readonly aspectRatio = input<string>('16/9');

  readonly internalPosition = signal(50);

  readonly clipPath = computed(() => `inset(0 ${100 - this.internalPosition()}% 0 0)`);

  constructor() {
    effect(() => this.internalPosition.set(this.position()), { allowSignalWrites: true });
  }

  onRangeInput(event: Event): void {
    this.internalPosition.set(Number((event.target as HTMLInputElement).value));
  }
}
