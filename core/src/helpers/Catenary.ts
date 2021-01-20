/**
 * Given two points and a length, calculate and return a catenary curve.
 *
 * JavaScript implementation:
 * Copyright (c) 2018 Jan Hug <me@dulnan.net>
 * Released under the MIT license.
 *
 * @example
 * // Initialize the catenary
 * const chain = new Catenary();
 * // Calculate an svg catenary curve path
 * const path = chain.getPath()
 *
 * @category Helpers
 */
import Point from './Point';

class Catenary {
  private p1 = new Point(0, 0);
  private p2 = new Point(0, 0);
  private segments: number;
  private iterationLimit: number;

  constructor(segments = 50, iterationLimit = 100) {
    this.segments = segments;
    this.iterationLimit = iterationLimit;
  }

  /**
   * Draws a catenary given two points
   */
  public getPath(point1: Point, point2: Point): string {
    this.p1.update(point1);
    this.p2.update(point2);

    const isFlipped = this.p1.x > this.p2.x;

    const p1 = isFlipped ? this.p2 : this.p1;
    const p2 = isFlipped ? this.p1 : this.p2;

    const distance = p1.getDistanceTo(p2);

    let curveData: number[][] | number[] = [];
    let isStraight = true;

    let chainLength = 300;

    switch (true) {
      case distance < 400:
        chainLength = 420;
        break;
      case distance < 900:
        chainLength = 940;
        break;
      case distance < 1400:
        chainLength = 1440;
        break;
      default:
        chainLength = distance * 1.05;
    }

    if (distance < chainLength) {
      const diff = p2.x - p1.x;

      if (diff > 0.01) {
        const h = p2.x - p1.x;
        const v = p2.y - p1.y;
        const a = -this.getCatenaryParameter(h, v, chainLength, this.iterationLimit);
        const x = (a * Math.log((chainLength + v) / (chainLength - v)) - h) * 0.5;
        const y = a * Math.cosh(x / a);
        const offsetX = p1.x - x;
        const offsetY = p1.y - y;
        curveData = this.getCurve(a, p1, p2, offsetX, offsetY, this.segments);
        isStraight = false;
      } else {
        const mx = (p1.x + p2.x) * 0.5;
        const my = (p1.y + p2.y + chainLength) * 0.5;

        curveData = [
          [p1.x, p1.y],
          [mx, my],
          [p2.x, p2.y],
        ];
      }
    } else {
      curveData = [
        [p1.x, p1.y],
        [p2.x, p2.y],
      ];
    }

    if (isStraight) {
      return this.drawLine(curveData as number[][]);
    } else {
      return this.drawCurve(curveData as number[]);
    }
  }

  /**
   * Determines catenary parameter
   */
  private getCatenaryParameter(h: number, v: number, length: number, limit: number) {
    const m = Math.sqrt(length * length - v * v) / h;
    let x = Math.acosh(m) + 1;
    let prevx = -1;
    let count = 0;

    while (Math.abs(x - prevx) > 1e-6 && count < limit) {
      prevx = x;
      x = x - (Math.sinh(x) - m * x) / (Math.cosh(x) - m);
      count++;
    }

    return h / (2 * x);
  }

  /**
   * Calculate the catenary curve.
   * Increasing the segments value will produce a catenary closer
   * to reality, but will require more calcluations.
   */
  private getCurve(a: number, p1: Point, p2: Point, offsetX: number, offsetY: number, segments: number) {
    const data = [p1.x, a * Math.cosh((p1.x - offsetX) / a) + offsetY];

    const d = p2.x - p1.x;
    const length = segments - 1;

    for (let i = 0; i < length; i++) {
      const x = p1.x + (d * (i + 0.5)) / length;
      const y = a * Math.cosh((x - offsetX) / a) + offsetY;
      data.push(x, y);
    }

    data.push(p2.x, a * Math.cosh((p2.x - offsetX) / a) + offsetY);

    return data;
  }

  /**
   * Draws a straight line between two points.
   */
  private drawLine(data: number[][]) {
    let result = '';
    for (let i = 0; i < data.length - 1; i++) {
      result = result + `M${data[i][0]},${data[i][1]} L${data[i + 1][0]},${data[i + 1][1]}`;
    }
    return result;
  }

  /**
   * Draws a quadratic curve between every calculated catenary segment,
   * so that the segments don't look like straight lines.
   */
  private drawCurve(data: number[]) {
    let result = '';
    let length = data.length * 0.5 - 1;
    let ox = data[2];
    let oy = data[3];

    const temp: number[][] = [];

    result = result + `M${data[0]},${data[1]}`;

    for (let i = 2; i < length; i++) {
      const x = data[i * 2];
      const y = data[i * 2 + 1];
      const mx = (x + ox) * 0.5;
      const my = (y + oy) * 0.5;
      temp.push([ox, oy, mx, my]);
      result = result + `Q${ox},${oy} ${mx},${my} `;
      ox = x;
      oy = y;
    }

    length = data.length;
    result = result + `Q${data[length - 4]},${data[length - 3]} ${data[length - 2]},${data[length - 1]}`;

    return result;
  }
}

export default Catenary;
