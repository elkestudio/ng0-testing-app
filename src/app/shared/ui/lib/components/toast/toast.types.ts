export type ToastVariant = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';

export interface ToastData {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}
