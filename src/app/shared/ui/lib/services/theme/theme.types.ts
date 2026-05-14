/**
 * A typed theme descriptor. Created via defineTheme().
 * CSS files remain pure design tokens — this type defines
 * what a theme IS (name, dark/light) at the TypeScript level.
 */
export interface ThemeDefinition {
  /** Must match [data-theme="..."] in the CSS file */
  readonly name: string;
  /** Whether this is a dark theme */
  readonly isDark: boolean;
}

/**
 * Type-safe factory — prevents typos, enables autocomplete.
 *
 * @example
 * ```ts
 * export const NG0_DARK = defineTheme({ name: 'ng0-editor-dark', isDark: true });
 * ```
 */
export function defineTheme(def: ThemeDefinition): ThemeDefinition {
  return Object.freeze(def);
}
