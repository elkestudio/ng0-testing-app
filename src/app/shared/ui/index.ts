// Layout
export { Ng0ContainerComponent } from './lib/components/layout/container/container.component';
export { Ng0SpacerComponent } from './lib/components/layout/spacer/spacer.component';
export { GridComponent as Ng0GridComponent, type GridLayoutMode } from './lib/components/layout/grid/grid.component';
export type {
  GridEngineItem,
  GridEngineConfig,
} from './lib/components/layout/grid/grid-engine';
export {
  packItems,
  addItem,
  removeItem,
  moveItem,
  resizeItem,
  canPlaceItem,
  getGridHeight,
  pixelToGrid,
  gridToPixel,
} from './lib/components/layout/grid/grid-engine';
// Style Widgets
export { LayoutWidgetComponent, type LayoutChange, type AlignValue, type JustifyValue, type DirectionValue, type WrapValue } from './lib/widgets/layout-widget/layout-widget.component';
export { TextStyleWidgetComponent, type TextStyleChange } from './lib/widgets/text-style-widget/text-style-widget.component';
export { SpacingBorderWidgetComponent, type SpacingBorderChange } from './lib/widgets/spacing-border-widget/spacing-border-widget.component';
export { ColorWidgetComponent, type ColorChange, type ColorChannel, type FillType, type GradientStop } from './lib/widgets/color-widget/color-widget.component';
export { BorderWidgetComponent, type BorderChange } from './lib/widgets/border-widget/border-widget.component';
export { EffectsWidgetComponent, type EffectsChange } from './lib/widgets/effects-widget/effects-widget.component';
export { WidgetShellComponent } from './lib/widgets/widget-shell/widget-shell.component';

// Widget Controls
export { WidgetButtonGroupComponent, type ButtonGroupOption } from './lib/widgets/widget-controls/widget-button-group.component';
export { WidgetSelectComponent, type WidgetSelectOption } from './lib/widgets/widget-controls/widget-select.component';
export { WidgetNumberComponent } from './lib/widgets/widget-controls/widget-number.component';

// Widget Prop Types
export type {
  ContentPropsChange, StackPropsChange, HeaderPropsChange, DockPropsChange,
  TextPropsChange, IconPropsChange, ImagePropsChange, VideoPropsChange, DividerPropsChange,
  ButtonPropsChange, InputPropsChange, SelectPropsChange, CheckboxPropsChange, TogglePropsChange, SliderPropsChange,
  CardPropsChange, BadgePropsChange, AvatarPropsChange, ProgressPropsChange,
} from './lib/widgets/widget-prop-types';

// Props Widgets
export { ContentPropsWidgetComponent } from './lib/widgets/content-props-widget/content-props-widget.component';
export { StackPropsWidgetComponent } from './lib/widgets/stack-props-widget/stack-props-widget.component';
export { HeaderPropsWidgetComponent } from './lib/widgets/header-props-widget/header-props-widget.component';
export { DockPropsWidgetComponent } from './lib/widgets/dock-props-widget/dock-props-widget.component';
export { AlertPropsWidgetComponent, type AlertPropsChange } from './lib/widgets/alert-props-widget/alert-props-widget.component';
export { AccordionPropsWidgetComponent, type AccordionPropsChange } from './lib/widgets/accordion-props-widget/accordion-props-widget.component';
export { TextareaPropsWidgetComponent, type TextareaPropsChange } from './lib/widgets/textarea-props-widget/textarea-props-widget.component';
export { LinkPropsWidgetComponent, type LinkPropsChange } from './lib/widgets/link-props-widget/link-props-widget.component';
export { ModalPropsWidgetComponent, type ModalPropsChange } from './lib/widgets/modal-props-widget/modal-props-widget.component';
export { TextPropsWidgetComponent } from './lib/widgets/text-props-widget/text-props-widget.component';
export { IconPropsWidgetComponent } from './lib/widgets/icon-props-widget/icon-props-widget.component';
export { ImagePropsWidgetComponent } from './lib/widgets/image-props-widget/image-props-widget.component';
export { VideoPropsWidgetComponent } from './lib/widgets/video-props-widget/video-props-widget.component';
export { DividerPropsWidgetComponent } from './lib/widgets/divider-props-widget/divider-props-widget.component';
export { ButtonPropsWidgetComponent } from './lib/widgets/button-props-widget/button-props-widget.component';
export { InputPropsWidgetComponent } from './lib/widgets/input-props-widget/input-props-widget.component';
export { SelectPropsWidgetComponent } from './lib/widgets/select-props-widget/select-props-widget.component';
export { CheckboxPropsWidgetComponent } from './lib/widgets/checkbox-props-widget/checkbox-props-widget.component';
export { TogglePropsWidgetComponent } from './lib/widgets/toggle-props-widget/toggle-props-widget.component';
export { SliderPropsWidgetComponent } from './lib/widgets/slider-props-widget/slider-props-widget.component';
export { CardPropsWidgetComponent } from './lib/widgets/card-props-widget/card-props-widget.component';
export { BadgePropsWidgetComponent } from './lib/widgets/badge-props-widget/badge-props-widget.component';
export { AvatarPropsWidgetComponent } from './lib/widgets/avatar-props-widget/avatar-props-widget.component';
export { ProgressPropsWidgetComponent } from './lib/widgets/progress-props-widget/progress-props-widget.component';

export type {
  SpacingToken,
  CrossAlign,
  MainJustify,
  ContainerSize,
} from './lib/components/layout/layout.types';

// Button
export { Ng0ButtonComponent } from './lib/components/button/button.component';
export type {
  ButtonVariant,
  ButtonSize,
  ButtonShape,
} from './lib/components/button/button.types';

// Input
export { Ng0InputComponent } from './lib/components/input/input.component';
export type {
  InputVariant,
  InputShape,
  InputSize,
} from './lib/components/input/input.types';

// Select
export { Ng0SelectComponent } from './lib/components/select/select.component';
export type { SelectOption } from './lib/components/select/select.component';

// Checkbox
export { Ng0CheckboxComponent } from './lib/components/checkbox/checkbox.component';

// Toggle
export { Ng0ToggleComponent } from './lib/components/toggle/toggle.component';

// Text
export { Ng0TextComponent } from './lib/components/text/text.component';
export type { TextSize } from './lib/components/text/text.types';

// Icon
export { Ng0IconComponent } from './lib/components/icon/icon.component';
export type { IconLibrary as IconLibraryType } from './lib/components/icon/icon.component';

// Divider
export { Ng0DividerComponent } from './lib/components/divider/divider.component';

// Card
export { Ng0CardComponent } from './lib/components/card/card/card.component';
export { Ng0CardHeaderComponent } from './lib/components/card/card-header/card-header.component';
export { Ng0CardTitleComponent } from './lib/components/card/card-title/card-title.component';
export { Ng0CardContentComponent } from './lib/components/card/card-content/card-content.component';
export { Ng0CardImageComponent } from './lib/components/card/card-image/card-image.component';
export { Ng0CardActionsComponent } from './lib/components/card/card-actions/card-actions.component';
export type { CardShape } from './lib/components/card/card.types';

// Badge
export { Ng0BadgeComponent } from './lib/components/badge/badge.component';
export type {
  BadgeVariant,
  BadgeSize,
  BadgeShape,
} from './lib/components/badge/badge.types';

// Avatar
export { Ng0AvatarComponent } from './lib/components/avatar/avatar.component';
export type {
  AvatarSize,
  AvatarShape,
} from './lib/components/avatar/avatar.types';

// Progress
export { Ng0ProgressComponent } from './lib/components/progress/progress.component';

// Spinner
export { Ng0SpinnerComponent } from './lib/components/spinner/spinner.component';

// Image
export { Ng0ImageComponent } from './lib/components/image/image.component';
export type {
  ImageObjectFit,
  ImageLoading,
  ImageDecoding,
} from './lib/components/image/image.types';

// Tabs
export {
  Ng0TabComponent,
  Ng0TabsComponent,
} from './lib/components/tabs/tabs.component';

// Accordion
export { Ng0AccordionItemComponent } from './lib/components/accordion/accordion.component';

// Modal
export { Ng0ModalComponent } from './lib/components/modal/modal.component';
export type {
  ModalSize,
  ModalAnimation,
} from './lib/components/modal/modal.types';

// Menu
export {
  Ng0MenuComponent,
  type MenuItem,
} from './lib/components/menu/menu.component';

// Header
export { Ng0HeaderComponent } from './lib/components/header/header.component';
export type {
  HeaderVariant,
  HeaderSize,
} from './lib/components/header/header.types';

// Content
export { Ng0ContentComponent } from './lib/components/content/content.component';
export type { ContentPadding } from './lib/components/content/content.types';

// Dock
export { Ng0DockComponent } from './lib/components/dock/dock.component';

// Stack
export { Ng0StackComponent, type StackDirection } from './lib/components/stack/stack.component';

// Join
export { Ng0JoinComponent } from './lib/components/join/join.component';
export type { JoinDirection } from './lib/components/join/join.component';

// Alert
export { Ng0AlertComponent } from './lib/components/alert/alert.component';
export type { AlertVariant } from './lib/components/alert/alert.types';

// Chip
export { Ng0ChipComponent } from './lib/components/chip/chip.component';
export type { ChipVariant, ChipSize, ChipColor } from './lib/components/chip/chip.types';

// Kbd
export { Ng0KbdComponent } from './lib/components/kbd/kbd.component';
export type { KbdSize } from './lib/components/kbd/kbd.types';

// Link
export { Ng0LinkComponent } from './lib/components/link/link.component';
export type { LinkVariant } from './lib/components/link/link.types';

// Skeleton
export { Ng0SkeletonComponent } from './lib/components/skeleton/skeleton.component';
export type { SkeletonVariant } from './lib/components/skeleton/skeleton.types';

// Breadcrumbs
export { Ng0BreadcrumbsComponent } from './lib/components/breadcrumbs/breadcrumbs.component';
export type { BreadcrumbItem, BreadcrumbSeparator } from './lib/components/breadcrumbs/breadcrumbs.types';

// Empty State
export { Ng0EmptyStateComponent } from './lib/components/empty-state/empty-state.component';

// Indicator
export { Ng0IndicatorComponent } from './lib/components/indicator/indicator.component';
export { Ng0IndicatorItemComponent } from './lib/components/indicator/indicator-item.component';
export type { IndicatorPosition } from './lib/components/indicator/indicator.types';

// Textarea
export { Ng0TextareaComponent } from './lib/components/textarea/textarea.component';
export type { TextareaVariant, TextareaSize } from './lib/components/textarea/textarea.types';

// Collapse
export { Ng0CollapseComponent } from './lib/components/collapse/collapse.component';

// Countdown
export { Ng0CountdownComponent } from './lib/components/countdown/countdown.component';

// FAB
export { Ng0FabComponent } from './lib/components/fab/fab.component';

// Pagination
export { Ng0PaginationComponent } from './lib/components/pagination/pagination.component';

// Radio
export { Ng0RadioComponent } from './lib/components/radio/radio.component';
export { Ng0RadioGroupComponent } from './lib/components/radio/radio-group.component';
export type { RadioSize, RadioColor } from './lib/components/radio/radio.types';
export type { RadioOption } from './lib/components/radio/radio-group.component';

// Range
export { Ng0RangeComponent } from './lib/components/range/range.component';
export type { RangeSize, RangeColor } from './lib/components/range/range.types';

// Switch
export { Ng0SwitchComponent } from './lib/components/switch/switch.component';
export type { SwitchSize, SwitchColor } from './lib/components/switch/switch.types';

// Rating
export { Ng0RatingComponent } from './lib/components/rating/rating.component';
export type { RatingSize, RatingShape, RatingColor } from './lib/components/rating/rating.types';

// Toast
export { Ng0ToastComponent } from './lib/components/toast/toast.component';
export { Ng0ToastContainerComponent } from './lib/components/toast/toast-container.component';
export type { ToastVariant, ToastPosition, ToastData } from './lib/components/toast/toast.types';

// Overlay service (base for all overlays)
export {
  OverlayService,
  type OverlayConfig,
  type OverlayRef,
  type ContextMenuItem,
  type ContextMenuConfig,
} from './lib/services/overlay/overlay.service';
export { Ng0ContextMenuComponent } from './lib/components/context-menu/context-menu.component';

// Popover service (positioned overlays via @floating-ui/dom)
export { PopoverService, type PopoverConfig, type PopoverRef } from './lib/services/popover/popover.service';

// OTP Input
export { Ng0OtpInputComponent } from './lib/components/otp-input/otp-input.component';

// Box Reveal
export { Ng0BoxRevealComponent } from './lib/components/box-reveal/box-reveal.component';

// Diff
export { Ng0DiffComponent } from './lib/components/diff/diff.component';

// Text Content
export { Ng0TextContentComponent } from './lib/components/text-content/text-content.component';

// Timeline
export { Ng0TimelineComponent } from './lib/components/timeline/timeline.component';
export { Ng0TimelineItemComponent } from './lib/components/timeline/timeline-item.component';
export { Ng0TimelineStartComponent } from './lib/components/timeline/timeline-start.component';
export { Ng0TimelineMiddleComponent } from './lib/components/timeline/timeline-middle.component';
export { Ng0TimelineEndComponent } from './lib/components/timeline/timeline-end.component';

// Stepper
export { Ng0StepperComponent } from './lib/components/stepper/stepper.component';
export { Ng0StepComponent } from './lib/components/stepper/step.component';
export type { StepStatus } from './lib/components/stepper/stepper.types';

// Carousel
export { Ng0CarouselComponent } from './lib/components/carousel/carousel.component';
export { Ng0CarouselItemComponent } from './lib/components/carousel/carousel-item.component';
export type { CarouselOptions } from './lib/components/carousel/carousel.types';

// Dropdown
export { Ng0DropdownComponent } from './lib/components/dropdown/dropdown.component';
export { Ng0DropdownTriggerDirective } from './lib/components/dropdown/dropdown-trigger.directive';
export { Ng0DropdownMenuComponent } from './lib/components/dropdown/dropdown-menu.component';
export { Ng0DropdownItemComponent } from './lib/components/dropdown/dropdown-item.component';
export type { DropdownPosition, DropdownAlign } from './lib/components/dropdown/dropdown.types';

// Autocomplete
export { Ng0AutocompleteComponent } from './lib/components/autocomplete/autocomplete.component';
export type { AutocompleteOption } from './lib/components/autocomplete/autocomplete.types';

// Date Picker
export { Ng0DatePickerComponent } from './lib/components/date-picker/date-picker.component';

// Time Picker
export { Ng0TimePickerComponent } from './lib/components/time-picker/time-picker.component';
export type { TimeValue } from './lib/components/time-picker/time-picker.types';

// Table
export { Ng0TableComponent } from './lib/components/table/table.component';
export type { TableColumn, TableAction, TableConfig, SortState } from './lib/components/table/table.types';

// Pipes
export { SafeHtmlPipe } from './lib/pipes/safe-html.pipe';

// Drawer service
export {
  DrawerService,
  type DrawerOptions,
  type DrawerRef,
  type DrawerPosition,
  type DrawerSize,
} from './lib/services/drawer/drawer.service';
export { DrawerContainerComponent } from './lib/services/drawer/drawer-container.component';

// Toast service
export { ToastService } from './lib/services/toast/toast.service';

// Clipboard service
export { ClipboardService } from './lib/services/clipboard/clipboard.service';

// Tooltip directive
export { TooltipDirective, type TooltipPosition } from './lib/directives/tooltip/tooltip.directive';

// LineClamp directive
export { LineClampDirective } from './lib/directives/line-clamp/line-clamp.directive';

// Theme
export {
  ThemeStore,
  type Theme,
  type ResolvedTheme,
  type FavoriteTheme,
  provideTheme,
  THEME_CONFIG,
  type ThemeConfig,
  defineTheme,
  type ThemeDefinition,
  LIGHT_THEME,
  DARK_THEME,
} from './lib/services/theme/index';

