import {
  Component,
  input,
  ChangeDetectionStrategy,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { StepStatus } from './stepper.types';

@Component({
  selector: 'ng0-step',
  standalone: true,
  imports: [],
  template: `
    @if (isActive) {
      <div role="tabpanel">
        <ng-content></ng-content>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ng0StepComponent {
  readonly label = input.required<string>();
  readonly description = input<string>();
  readonly icon = input<string>();
  readonly optional = input<boolean>(false);

  private readonly cdr = inject(ChangeDetectorRef);
  private _isActive = false;
  private _status: StepStatus = 'pending';

  get isActive(): boolean { return this._isActive; }
  set isActive(value: boolean) {
    if (this._isActive !== value) {
      this._isActive = value;
      this.cdr.markForCheck();
    }
  }

  get status(): StepStatus { return this._status; }
  set status(value: StepStatus) {
    if (this._status !== value) {
      this._status = value;
      this.cdr.markForCheck();
    }
  }
}
