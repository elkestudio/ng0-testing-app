/**
 * Change interfaces for all component property widgets.
 * Each widget emits a partial of its props through output<*PropsChange>().
 */

// Layout
export interface ContentPropsChange { padding?: string; fullscreen?: boolean; overflow?: string; }
export interface StackPropsChange { direction?: string; gap?: string; align?: string; justify?: string; wrap?: boolean; reverse?: boolean; overflow?: string; }
export interface HeaderPropsChange { variant?: string; size?: string; sticky?: boolean; fixed?: boolean; }
export interface DockPropsChange { position?: string; size?: string; fixed?: boolean; floating?: boolean; }

// Content
export interface TextPropsChange { content?: string; variant?: string; }
export interface IconPropsChange { name?: string; size?: number; }
export interface ImagePropsChange { src?: string; alt?: string; objectFit?: string; }
export interface VideoPropsChange { src?: string; }
export interface DividerPropsChange { orientation?: string; }

// Interactive
export interface ButtonPropsChange { label?: string; variant?: string; size?: string; btnWidth?: string; shape?: string; icon?: string; iconOnly?: boolean; iconPosition?: string; }
export interface InputPropsChange { placeholder?: string; variant?: string; size?: string; }
export interface SelectPropsChange { placeholder?: string; options?: { label: string; value: string }[]; }
export interface CheckboxPropsChange { label?: string; }
export interface TogglePropsChange { label?: string; }
export interface SliderPropsChange { min?: number; max?: number; value?: number; }

// Data Display
export interface CardPropsChange { bordered?: boolean; shape?: string; compact?: boolean; }
export interface BadgePropsChange { content?: string; variant?: string; size?: string; }
export interface AvatarPropsChange { src?: string; name?: string; size?: string; shape?: string; }
export interface ProgressPropsChange { value?: number; max?: number; color?: string; }
