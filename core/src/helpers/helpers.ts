/**
 * Transform a value between two ranges
 * @param value - Current value
 * @param from - [min, max] current value range
 * @param to -  [min, max] target value range
 * @param precision - scaled value decimal places precision
 *
 * @example
 * // scale a value
 * const scaledValue = scale(originalValue, [0, 100], [25, 50], 2);
 *
 * @category Helpers
 */
export const scale = (value: number, from: [number, number], to: [number, number], precision = 2): number => {
  const scaled = (to[1] - to[0]) / (from[1] - from[0]);
  const capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
  return round(capped * scaled + to[0], precision);
};

/**
 * Round a number with specific decimal places precision
 *
 * @example
 * const freq = round(420.240);
 *
 * @category Helpers
 */
export const round = (value: number, precision = 0): number => {
  const p = Math.pow(10, precision);
  const m = value * p * (1 + Number.EPSILON);
  return Math.round(m) / p;
};

/**
 * Check if a keyboard event can be intercepted as a shortcut
 *
 * @example
 * // skip processing a keyboard event if definately not a shortcut
 * const onKeyDown = (e: KeyboardEvent) => {
 *    if(!isShortcut()){
 *        return true;
 *    }
 * }
 *
 * @category Helpers
 */
export const isShortcut = (e: KeyboardEvent): boolean => {
  const tagName = (e.target as HTMLElement).tagName.toLowerCase();
  return ['input', 'textarea'].indexOf(tagName) < 0;
};

/**
 * Retruns a random color hex code from a predefined list
 *
 * @example
 * const color = randomColor()
 *
 * @category Helpers
 */
export const randomColor = (): string => {
  const colors = ['#E6EB74', '#98D2DE', '#8ACB74', '#DC4846'];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Convert module title name to a safe file name
 *
 * @example
 * const fileName = safeName(input);
 *
 * @category Helpers
 */
export const safeName = (name: string): string => {
  return name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
};
