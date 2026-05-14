import {
  Component,
  input,
  output,
  signal,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CountdownVariant } from './countdown.types';

@Component({
  selector: 'ng0-countdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './countdown.component.html',
})
export class Ng0CountdownComponent implements OnInit, OnDestroy {
  readonly targetDate = input.required<Date | string>();
  readonly variant = input<CountdownVariant>('box');
  readonly showDays = input<boolean>(true);
  readonly showHours = input<boolean>(true);
  readonly showMinutes = input<boolean>(true);
  readonly showSeconds = input<boolean>(true);

  readonly completed = output<void>();

  private readonly platformId = inject(PLATFORM_ID);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  protected readonly days = signal(0);
  protected readonly hours = signal(0);
  protected readonly minutes = signal(0);
  protected readonly seconds = signal(0);

  ngOnInit(): void {
    this.updateTime();
    if (isPlatformBrowser(this.platformId)) {
      this.intervalId = setInterval(() => this.updateTime(), 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateTime(): void {
    const target = new Date(this.targetDate()).getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);

    if (diff === 0) {
      this.days.set(0);
      this.hours.set(0);
      this.minutes.set(0);
      this.seconds.set(0);
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.completed.emit();
      return;
    }

    this.days.set(Math.floor(diff / (1000 * 60 * 60 * 24)));
    this.hours.set(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    this.minutes.set(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
    this.seconds.set(Math.floor((diff % (1000 * 60)) / 1000));
  }

  protected pad(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
