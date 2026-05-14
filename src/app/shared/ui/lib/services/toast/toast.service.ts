import {
  Injectable,
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
} from '@angular/core';
import { Ng0ToastContainerComponent } from '../../components/toast/toast-container.component';
import { ToastVariant, ToastPosition } from '../../components/toast/toast.types';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);
  private containerRef: ComponentRef<Ng0ToastContainerComponent> | null = null;

  show(message: string, variant: ToastVariant = 'info', duration = 3000): void {
    const container = this.ensureContainer();
    container.instance.addToast({
      id: crypto.randomUUID(),
      message,
      variant,
      duration,
    });
  }

  success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 3000): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration = 3000): void {
    this.show(message, 'warning', duration);
  }

  setPosition(position: ToastPosition): void {
    const container = this.ensureContainer();
    container.instance.position = position;
  }

  private ensureContainer(): ComponentRef<Ng0ToastContainerComponent> {
    if (this.containerRef) return this.containerRef;

    this.containerRef = createComponent(Ng0ToastContainerComponent, {
      environmentInjector: this.injector,
    });

    this.appRef.attachView(this.containerRef.hostView);
    document.body.appendChild(this.containerRef.location.nativeElement);

    return this.containerRef;
  }
}
