import Decimal from 'decimal.js';

export enum AngleMode {
  DEGREE = 'DEG',
  RADIAN = 'RAD',
  GRADIAN = 'GRAD'
}

export class ScientificEngine {
  private precision = 15;

  // 角度转换
  toRadians(value: number, mode: AngleMode): number {
    switch (mode) {
      case AngleMode.DEGREE:
        return value * Math.PI / 180;
      case AngleMode.GRADIAN:
        return value * Math.PI / 200;
      default:
        return value;
    }
  }

  fromRadians(value: number, mode: AngleMode): number {
    switch (mode) {
      case AngleMode.DEGREE:
        return value * 180 / Math.PI;
      case AngleMode.GRADIAN:
        return value * 200 / Math.PI;
      default:
        return value;
    }
  }

  // 三角函数
  sin(value: number, angleMode: AngleMode): number {
    const radians = this.toRadians(value, angleMode);
    return Number(new Decimal(Math.sin(radians)).toFixed(this.precision));
  }

  cos(value: number, angleMode: AngleMode): number {
    const radians = this.toRadians(value, angleMode);
    return Number(new Decimal(Math.cos(radians)).toFixed(this.precision));
  }

  tan(value: number, angleMode: AngleMode): number {
    const radians = this.toRadians(value, angleMode);
    if (Math.abs(Math.cos(radians)) < 1e-15) {
      throw new Error('Undefined (tan of π/2 + nπ)');
    }
    return Number(new Decimal(Math.tan(radians)).toFixed(this.precision));
  }

  // 反三角函数
  asin(value: number, angleMode: AngleMode): number {
    if (Math.abs(value) > 1) {
      throw new Error('Domain error: asin input must be between -1 and 1');
    }
    const result = Math.asin(value);
    return this.fromRadians(result, angleMode);
  }

  acos(value: number, angleMode: AngleMode): number {
    if (Math.abs(value) > 1) {
      throw new Error('Domain error: acos input must be between -1 and 1');
    }
    const result = Math.acos(value);
    return this.fromRadians(result, angleMode);
  }

  atan(value: number, angleMode: AngleMode): number {
    const result = Math.atan(value);
    return this.fromRadians(result, angleMode);
  }

  // 双曲三角函数
  sinh(value: number): number {
    return Number(new Decimal(Math.sinh(value)).toFixed(this.precision));
  }

  cosh(value: number): number {
    return Number(new Decimal(Math.cosh(value)).toFixed(this.precision));
  }

  tanh(value: number): number {
    return Number(new Decimal(Math.tanh(value)).toFixed(this.precision));
  }

  // 对数函数
  ln(value: number): number {
    if (value <= 0) {
      throw new Error('Domain error: ln input must be positive');
    }
    return Number(new Decimal(Math.log(value)).toFixed(this.precision));
  }

  log(value: number): number {
    if (value <= 0) {
      throw new Error('Domain error: log input must be positive');
    }
    return Number(new Decimal(Math.log10(value)).toFixed(this.precision));
  }

  log2(value: number): number {
    if (value <= 0) {
      throw new Error('Domain error: log2 input must be positive');
    }
    return Number(new Decimal(Math.log2(value)).toFixed(this.precision));
  }

  logBase(value: number, base: number): number {
    if (value <= 0 || base <= 0 || base === 1) {
      throw new Error('Domain error: invalid logarithm parameters');
    }
    return Number(new Decimal(Math.log(value) / Math.log(base)).toFixed(this.precision));
  }

  // 指数函数
  exp(value: number): number {
    return Number(new Decimal(Math.exp(value)).toFixed(this.precision));
  }

  pow10(value: number): number {
    return Number(new Decimal(Math.pow(10, value)).toFixed(this.precision));
  }

  power(base: number, exponent: number): number {
    return Number(new Decimal(Math.pow(base, exponent)).toFixed(this.precision));
  }

  // 根式函数
  sqrt(value: number): number {
    if (value < 0) {
      throw new Error('Domain error: sqrt of negative number');
    }
    return Number(new Decimal(Math.sqrt(value)).toFixed(this.precision));
  }

  cbrt(value: number): number {
    return Number(new Decimal(Math.cbrt(value)).toFixed(this.precision));
  }

  nthRoot(value: number, n: number): number {
    if (n === 0) {
      throw new Error('Domain error: root index cannot be zero');
    }
    if (n % 2 === 0 && value < 0) {
      throw new Error('Domain error: even root of negative number');
    }
    return Number(new Decimal(Math.pow(value, 1/n)).toFixed(this.precision));
  }

  // 其他函数
  factorial(n: number): number {
    if (n < 0 || !Number.isInteger(n)) {
      throw new Error('Domain error: factorial requires non-negative integer');
    }
    if (n > 170) {
      throw new Error('Overflow: factorial too large');
    }
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  percentage(value: number): number {
    return value / 100;
  }

  reciprocal(value: number): number {
    if (value === 0) {
      throw new Error('Division by zero');
    }
    return Number(new Decimal(1).dividedBy(value).toFixed(this.precision));
  }

  absolute(value: number): number {
    return Math.abs(value);
  }
}
