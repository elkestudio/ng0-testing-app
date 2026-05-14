export type RadioSize = 'sm' | 'md' | 'lg';
export type RadioColor = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}
