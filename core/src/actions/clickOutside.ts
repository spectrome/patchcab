import type { Action } from '../types';

export type OnClickOutside = (e: MouseEvent) => void;

/**
 * Detect a click outside of the target element or it's children
 *
 * @example
 *
 * <div use:useClickOutside={oClickOutside} />
 *
 * @category Actions
 */
const useClickOutside: Action<OnClickOutside> = (node, onClickOutside) => {
  if (typeof onClickOutside !== 'function') {
    return;
  }

  const onMousedown = (event: MouseEvent) => {
    let parent = event.target as HTMLElement;
    let isChild = false;

    while (parent) {
      if (parent === node) {
        isChild = true;
        break;
      }
      parent = parent.parentNode as HTMLElement;
    }

    if (!isChild) {
      onClickOutside(event);
    }
  };

  document.addEventListener('mousedown', onMousedown, { passive: true });
  document.addEventListener('touchstart', onMousedown, { passive: true });

  return {
    destroy() {
      document.removeEventListener('mousedown', onMousedown);
      document.removeEventListener('touchstart', onMousedown);
    },
  };
};

export default useClickOutside;
