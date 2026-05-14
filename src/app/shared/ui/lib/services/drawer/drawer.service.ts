import {
  Injectable,
  inject,
  Type,
  createComponent,
  EnvironmentInjector,
  ApplicationRef,
  Injector,
} from '@angular/core';
import { OverlayService } from '../overlay/overlay.service';
import { DrawerContainerComponent } from './drawer-container.component';

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DrawerOptions<T = unknown> {
  component: Type<T>;
  componentProps?: Partial<T>;
  position?: DrawerPosition;
  size?: DrawerSize;
  title?: string;
  showClose?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showBackdrop?: boolean;
  cssClass?: string;
  container?: HTMLElement;
  id?: string;
  width?: string;
  height?: string;
}

export interface DrawerRef<T = unknown> {
  close: (data?: unknown) => void;
  onClose: Promise<{ data?: unknown }>;
  componentInstance: T;
}

const SIZE_MAP: Record<DrawerSize, { h: string; v: string }> = {
  sm:   { h: 'w-64',      v: 'h-48'     },
  md:   { h: 'w-80',      v: 'h-64'     },
  lg:   { h: 'w-96',      v: 'h-96'     },
  xl:   { h: 'w-[32rem]', v: 'h-[32rem]' },
  full: { h: 'w-full',    v: 'h-full'   },
};

@Injectable({ providedIn: 'root' })
export class DrawerService {
  private readonly overlayService = inject(OverlayService);
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);

  private readonly activeDrawers = new Map<string, { close: () => void }>();
  private readonly drawerById = new Map<string, DrawerRef<unknown>>();

  open<T>(options: DrawerOptions<T>): DrawerRef<T> {
    const {
      component,
      componentProps = {},
      position = 'right',
      size = 'md',
      title,
      showClose = true,
      closeOnBackdrop = true,
      closeOnEscape = true,
      showBackdrop = true,
      cssClass = '',
      container,
      id,
      width,
      height,
    } = options;

    this.overlayService.injectAnimationStyles();

    const drawerId = id ?? `drawer-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    if (id && this.drawerById.has(id)) {
      this.drawerById.get(id)?.close();
    }

    const isHorizontal = position === 'left' || position === 'right';
    const sizeClass = isHorizontal ? SIZE_MAP[size].h : SIZE_MAP[size].v;

    // Determine host
    const isScoped = !!container;
    let host: HTMLElement;
    if (isScoped && container) {
      host = container;
      const pos = window.getComputedStyle(host).position;
      if (pos === 'static') host.style.position = 'relative';
      host.style.overflow = 'hidden';
    } else {
      host = this.overlayService.getOverlayHost();
    }

    // Backdrop
    let backdrop: HTMLElement | null = null;
    if (showBackdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'ng0-drawer-backdrop-enter';
      backdrop.style.cssText = isScoped
        ? 'position: absolute; inset: 0; background: rgba(0,0,0,0.45); pointer-events: auto; z-index: 100;'
        : 'position: fixed; inset: 0; background: rgba(0,0,0,0.45); pointer-events: auto; z-index: 0;';
      if (closeOnBackdrop) {
        backdrop.addEventListener('click', () => close());
      }
      host.appendChild(backdrop);
    }

    // Drawer wrapper
    const wrapper = document.createElement('div');
    wrapper.classList.add(`ng0-drawer-slide-in-${position}`);

    const baseZ = isScoped ? 110 : 10;
    const positionStyles: Record<DrawerPosition, string> = {
      left:   `position: ${isScoped ? 'absolute' : 'fixed'}; top: 0; left: 0;   height: 100%; max-width: 100vw; pointer-events: auto; z-index: ${baseZ};`,
      right:  `position: ${isScoped ? 'absolute' : 'fixed'}; top: 0; right: 0;  height: 100%; max-width: 100vw; pointer-events: auto; z-index: ${baseZ};`,
      top:    `position: ${isScoped ? 'absolute' : 'fixed'}; top: 0; left: 0;   width: 100%;  max-height: 100%;  pointer-events: auto; z-index: ${baseZ};`,
      bottom: `position: ${isScoped ? 'absolute' : 'fixed'}; bottom: 0; left: 0; width: 100%; max-height: 100%; pointer-events: auto; z-index: ${baseZ};`,
    };
    wrapper.style.cssText = positionStyles[position];
    if (width)  wrapper.style.width  = width;
    if (height) wrapper.style.height = height;

    // Create container component
    const containerRef = createComponent(DrawerContainerComponent, {
      environmentInjector: this.injector,
    });

    const drawerContainer = containerRef.instance;
    drawerContainer.title = title;
    drawerContainer.showClose = showClose;
    drawerContainer.sizeClass = sizeClass;
    drawerContainer.cssClass = cssClass;

    this.appRef.attachView(containerRef.hostView);

    // Create content component
    const contentInjector = Injector.create({
      providers: (Object.entries(componentProps) as [string, unknown][]).map(([key, value]) => ({
        provide: key,
        useValue: value,
      })),
      parent: this.injector,
    });

    const contentRef = drawerContainer.contentHost.createComponent(component, {
      injector: contentInjector,
    });

    Object.entries(componentProps).forEach(([key, value]) => {
      (contentRef.instance as Record<string, unknown>)[key] = value;
    });

    containerRef.changeDetectorRef.detectChanges();

    wrapper.appendChild(containerRef.location.nativeElement as HTMLElement);
    host.appendChild(wrapper);

    // Close logic
    let resolveClose!: (result: { data?: unknown }) => void;
    const onClosePromise = new Promise<{ data?: unknown }>((resolve) => {
      resolveClose = resolve;
    });

    const close = (data?: unknown) => {
      if (!this.activeDrawers.has(drawerId)) return;
      this.activeDrawers.delete(drawerId);
      if (id) this.drawerById.delete(id);
      if (escapeListener) document.removeEventListener('keydown', escapeListener);

      if (backdrop) {
        backdrop.classList.remove('ng0-drawer-backdrop-enter');
        backdrop.classList.add('ng0-drawer-backdrop-exit');
      }
      wrapper.classList.remove(`ng0-drawer-slide-in-${position}`);
      wrapper.classList.add(`ng0-drawer-slide-out-${position}`);

      const cleanup = () => {
        backdrop?.remove();
        wrapper.remove();
        if (isScoped && container) container.style.overflow = '';
        this.appRef.detachView(containerRef.hostView);
        containerRef.destroy();
        resolveClose({ data });
      };

      wrapper.addEventListener('animationend', cleanup, { once: true });
      setTimeout(() => { if (wrapper.parentNode) cleanup(); }, 350);
    };

    drawerContainer.closeHandler = () => close();
    this.activeDrawers.set(drawerId, { close });

    // Escape key
    let escapeListener: ((e: KeyboardEvent) => void) | null = null;
    if (closeOnEscape) {
      escapeListener = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
      document.addEventListener('keydown', escapeListener);
    }

    const drawerRef: DrawerRef<T> = {
      close,
      onClose: onClosePromise,
      componentInstance: contentRef.instance,
    };

    if (id) this.drawerById.set(id, drawerRef as DrawerRef<unknown>);
    return drawerRef;
  }

  toggle<T>(options: DrawerOptions<T>): DrawerRef<T> | null {
    if (!options.id) return this.open(options);
    if (this.drawerById.has(options.id)) {
      this.drawerById.get(options.id)?.close();
      return null;
    }
    return this.open(options);
  }

  isOpen(id: string): boolean {
    return this.drawerById.has(id);
  }

  close(id: string): void {
    this.drawerById.get(id)?.close();
  }

  closeAll(): void {
    this.activeDrawers.forEach((instance) => instance.close());
  }
}
