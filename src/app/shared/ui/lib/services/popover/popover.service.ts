import {
  Injectable,
  inject,
  Type,
  createComponent,
  EnvironmentInjector,
  ApplicationRef,
  ComponentRef,
  Injector,
} from '@angular/core';
import {
  computePosition,
  autoUpdate,
  flip,
  shift,
  offset,
  limitShift,
  Placement,
} from '@floating-ui/dom';
import { OverlayService } from '../overlay/overlay.service';

export interface PopoverConfig {
  triggerElement: HTMLElement;
  position?: string;
  offsetY?: number;
  offsetX?: number;
  matchWidth?: boolean;
  backdropClass?: string;
  inputs?: Record<string, unknown>;
  injector?: Injector;
  onClose?: () => void;
}

export interface PopoverRef {
  close: () => void;
  updatePosition: () => void;
  overlayElement: HTMLElement;
}

@Injectable({ providedIn: 'root' })
export class PopoverService {
  private readonly overlayService = inject(OverlayService);
  private readonly injector = inject(EnvironmentInjector);
  private readonly appRef = inject(ApplicationRef);

  private currentPopoverRef: PopoverRef | null = null;
  private currentBackdrop: HTMLElement | null = null;
  private cleanupAutoUpdate: (() => void) | null = null;

  open<T>(content: HTMLElement | Type<T>, config: PopoverConfig): PopoverRef {
    this.closeAll();
    this.overlayService.injectAnimationStyles();

    const host = this.overlayService.getOverlayHost();

    if (config.backdropClass) {
      const backdrop = document.createElement('div');
      backdrop.className = config.backdropClass;
      backdrop.style.cssText =
        'position: fixed; inset: 0; pointer-events: auto; z-index: 0;';
      backdrop.addEventListener('click', () => close());
      host.appendChild(backdrop);
      this.currentBackdrop = backdrop;
    }

    let domContent: HTMLElement;
    let componentRef: ComponentRef<T> | null = null;

    if (content instanceof HTMLElement) {
      domContent = content;
    } else {
      componentRef = createComponent(content, {
        environmentInjector: this.injector,
        elementInjector: config.injector,
      });

      if (config.inputs) {
        for (const [key, value] of Object.entries(config.inputs)) {
          componentRef.setInput(key, value);
        }
      }

      this.appRef.attachView(componentRef.hostView);
      domContent = componentRef.location.nativeElement as HTMLElement;
    }

    const overlayWrapper = document.createElement('div');
    overlayWrapper.style.cssText =
      'position: absolute; pointer-events: auto; z-index: 10; width: max-content; top: 0; left: 0;';
    overlayWrapper.appendChild(domContent);
    host.appendChild(overlayWrapper);

    const updatePosition = () => {
      const placement = (config.position || 'bottom') as Placement;
      computePosition(config.triggerElement, overlayWrapper, {
        placement,
        middleware: [
          offset(config.offsetY ?? 4),
          flip(),
          shift({ limiter: limitShift() }),
        ],
        strategy: 'absolute',
      }).then(({ x, y }) => {
        overlayWrapper.style.left = `${x}px`;
        overlayWrapper.style.top = `${y}px`;
        if (config.matchWidth) {
          const rect = config.triggerElement.getBoundingClientRect();
          overlayWrapper.style.width = `${rect.width}px`;
        }
      });
    };

    this.cleanupAutoUpdate = autoUpdate(
      config.triggerElement,
      overlayWrapper,
      updatePosition,
    );

    const close = () => {
      if (this.cleanupAutoUpdate) {
        this.cleanupAutoUpdate();
        this.cleanupAutoUpdate = null;
      }
      overlayWrapper.remove();
      if (this.currentBackdrop) {
        this.currentBackdrop.remove();
        this.currentBackdrop = null;
      }
      if (componentRef) {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
        componentRef = null;
      }
      if (config.onClose) config.onClose();
      this.currentPopoverRef = null;
    };

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (overlayWrapper.contains(target) || config.triggerElement.contains(target)) return;
      if (!config.backdropClass) {
        close();
        document.removeEventListener('click', handleDocumentClick, true);
      }
    };

    if (!config.backdropClass) {
      setTimeout(() =>
        document.addEventListener('click', handleDocumentClick, true), 0);
    }

    const popoverRef: PopoverRef = {
      close: () => {
        if (!config.backdropClass) {
          document.removeEventListener('click', handleDocumentClick, true);
        }
        close();
      },
      updatePosition,
      overlayElement: overlayWrapper,
    };

    this.currentPopoverRef = popoverRef;
    return popoverRef;
  }

  closeAll(): void {
    if (this.currentPopoverRef) {
      this.currentPopoverRef.close();
    }
  }
}
