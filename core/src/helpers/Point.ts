/**
 * Define a point in 2D space
 *
 * @example
 * // Create a point
 * const pointA = new Point(0, 0);
 * // Update point positions
 * pointA.update(10, 10)
 * // Get a distance to another point
 * const distance = pointA.getDistanceTo(pointB);
 *
 * @category Helpers
 */
class Point {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Update the x and y values
   */
  update(point: Point): void {
    this.x = point.x;
    this.y = point.y;
  }

  /**
   * Get the difference for x and y axis to another point
   */
  getDifferenceTo(point: Point): Point {
    return new Point(this.x - point.x, this.y - point.y);
  }

  /**
   * Calculate distance to another point
   */
  getDistanceTo(point: Point): number {
    const diff = this.getDifferenceTo(point);
    return Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2));
  }
}

export default Point;
