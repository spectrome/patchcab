import type { Action } from '../types';

export type OnPan = (value: { x: number; y: number; dx?: number; dy?: number }) => void;

/**
 * Element pan event
 *
 * @example
 *
 * <div use:usePan={onPan} />
 *
 * @category Actions
 */
const usePan: Action<OnPan> = (node, onMove) => {
  let x: number;
  let y: number;

  if (typeof onMove !== 'function') {
    return;
  }

  const onMousedown = (event: MouseEvent | TouchEvent) => {
    x = 'clientX' in event ? event.clientX : event.touches[0].clientX;
    y = 'clientY' in event ? event.clientY : event.touches[0].clientY;

    window.addEventListener('mousemove', onMousemove, { passive: true });
    window.addEventListener('touchmove', onMousemove, { passive: true });
    window.addEventListener('mouseup', onMouseup, { passive: true });
    window.addEventListener('touchend', onMouseup, { passive: true });
  };

  const onMousemove = (event: MouseEvent | TouchEvent) => {
    const newX = 'clientX' in event ? event.clientX : event.touches[0].clientX;
    const newY = 'clientY' in event ? event.clientY : event.touches[0].clientY;

    const dx = newX - x;
    const dy = newY - y;

    x = newX;
    y = newY;

    onMove({ x, y, dx, dy });
  };

  const onMouseup = () => {
    window.removeEventListener('mousemove', onMousemove);
    window.removeEventListener('touchmove', onMousemove);
    window.removeEventListener('mouseup', onMouseup);
    window.removeEventListener('touchend', onMouseup);
  };

  node.addEventListener('mousedown', onMousedown, { passive: true });
  node.addEventListener('touchstart', onMousedown, { passive: true });

  return {
    destroy() {
      node.removeEventListener('mousedown', onMousedown);
      node.removeEventListener('touchstart', onMousedown);
    },
  };
};

export default usePan;
