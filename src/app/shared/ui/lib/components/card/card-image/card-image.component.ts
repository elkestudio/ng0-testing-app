import {
  Component,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'ng0-card-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block overflow-hidden' },
  templateUrl: './card-image.component.html',
})
export class Ng0CardImageComponent {
  readonly src = input.required<string>();
  readonly alt = input('');
}
