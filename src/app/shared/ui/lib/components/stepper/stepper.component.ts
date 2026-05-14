import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  contentChildren,
  effect,
} from '@angular/core';
import { Ng0StepComponent } from './step.component';
import { Ng0IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ng0-stepper',
  standalone: true,
  imports: [Ng0IconComponent],
  templateUrl: './stepper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ng0StepperComponent {
  readonly activeStep = input<number>(0);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly linear = input<boolean>(true);

  readonly stepChange = output<number>();

  readonly steps = contentChildren(Ng0StepComponent);

  private currentIndex = 0;

  constructor() {
    effect(() => {
      this.currentIndex = this.activeStep();
      this.updateStepStates();
    });
  }

  goToStep(index: number): void {
    if (this.linear() && index > this.currentIndex + 1) return;
    if (index < 0 || index >= this.steps().length) return;
    this.currentIndex = index;
    this.updateStepStates();
    this.stepChange.emit(index);
  }

  next(): void { this.goToStep(this.currentIndex + 1); }
  previous(): void { this.goToStep(this.currentIndex - 1); }

  private updateStepStates(): void {
    this.steps().forEach((step, index) => {
      step.isActive = index === this.currentIndex;
      step.status = index < this.currentIndex ? 'completed'
        : index === this.currentIndex ? 'current'
        : 'pending';
    });
  }

  get currentStepIndex(): number { return this.currentIndex; }
  get stepsArray(): readonly Ng0StepComponent[] { return this.steps(); }
}
