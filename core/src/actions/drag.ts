import type { Action } from '../types';
import { BAR_HEIGHT } from '../contstants';

export type OnDrag = (x: number, y: number, box: DOMRect) => void;

/**
 * Element drag event
 *
 * @example
 *
 * <div use:onDrag={dragCallback} />
 *
 * @category Actions
 */
const useDrag: Action<OnDrag> = (node, onDrag) => {
  if (typeof onDrag !== 'function') {
    return;
  }

  let offset: number;

  const onMousedown = (event: MouseEvent | TouchEvent) => {
    if (event.target !== node && (event.target as HTMLElement).getAttribute('draggable') === null) {
      return;
    }

    const clientX = 'clientX' in event ? event.clientX : event.touches[0].clientX;
    offset = clientX - node.getBoundingClientRect().left;

    window.addEventListener('mousemove', onMousemove, { passive: true });
    window.addEventListener('touchmove', onMousemove, { passive: true });
    window.addEventListener('mouseup', onMouseup, { passive: true });
    window.addEventListener('touchend', onMouseup, { passive: true });
  };

  const onMousemove = (event: MouseEvent | TouchEvent) => {
    const box = node.getBoundingClientRect();

    const scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    const scrollY = document.documentElement.scrollTop || document.body.scrollTop;

    const clientX = 'clientX' in event ? event.clientX : event.touches[0].clientX;
    const clientY = 'clientY' in event ? event.clientY : event.touches[0].clientY;

    const x = clientX + scrollX - offset;
    const y = clientY + scrollY - BAR_HEIGHT;

    onDrag(x, y, box);
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

export default useDrag;
