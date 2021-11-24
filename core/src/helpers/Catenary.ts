import type Point from './Point';

/**
 * Get an SVG quadratic bézier curve path based simulating a catenary curve
 * @param p1 - Line Start point
 * @param p2 - Line End point
 *
 * @category Helpers
 */
export const getCatenaryPath = (p1: Point, p2: Point): string => {
  const distance = p1.getDistanceTo(p2);

  let length = 100;

  switch (true) {
    case distance < 400:
      length = 420;
      break;
    case distance < 900:
      length = 940;
      break;
    case distance < 1400:
      length = 1440;
      break;
    default:
      length = distance * 1.05;
  }

  const controlX = Math.round((p1.x + p2.x) / 2);
  const controlY = Math.round(Math.max(p1.y, p2.y) + length - distance * 0.5);

  return `M ${p1.x} ${p1.y} Q ${controlX} ${controlY} ${p2.x} ${p2.y}`;
};
