import { describe, it, expect } from 'vitest';
import { ScientificEngine, AngleMode } from '../../src/services/scientific-engine';

describe('ScientificEngine', () => {
  const engine = new ScientificEngine();

  describe('三角函数 - 度模式', () => {
    it('TC-001: sin(30°) 应该返回 0.5', () => {
      const result = engine.sin(30, AngleMode.DEGREE);
      expect(result).toBeCloseTo(0.5, 10);
    });

    it('TC-002: cos(60°) 应该返回 0.5', () => {
      const result = engine.cos(60, AngleMode.DEGREE);
      expect(result).toBeCloseTo(0.5, 10);
    });

    it('TC-003: tan(45°) 应该返回 1', () => {
      const result = engine.tan(45, AngleMode.DEGREE);
      expect(result).toBeCloseTo(1, 10);
    });
  });

  describe('三角函数 - 弧度模式', () => {
    it('TC-004: sin(π) 应该接近 0', () => {
      const result = engine.sin(Math.PI, AngleMode.RADIAN);
      expect(Math.abs(result)).toBeLessThan(1e-10);
    });

    it('TC-005: cos(π) 应该返回 -1', () => {
      const result = engine.cos(Math.PI, AngleMode.RADIAN);
      expect(result).toBeCloseTo(-1, 10);
    });
  });

  describe('反三角函数', () => {
    it('TC-006: asin(0.5) 应该返回 30°', () => {
      const result = engine.asin(0.5, AngleMode.DEGREE);
      expect(result).toBeCloseTo(30, 10);
    });

    it('TC-007: acos(0.5) 应该返回 60°', () => {
      const result = engine.acos(0.5, AngleMode.DEGREE);
      expect(result).toBeCloseTo(60, 10);
    });

    it('TC-008: atan(1) 应该返回 45°', () => {
      const result = engine.atan(1, AngleMode.DEGREE);
      expect(result).toBeCloseTo(45, 10);
    });
  });

  describe('对数函数', () => {
    it('TC-009: ln(e) 应该返回 1', () => {
      const result = engine.ln(Math.E);
      expect(result).toBeCloseTo(1, 10);
    });

    it('TC-010: log(100) 应该返回 2', () => {
      const result = engine.log(100);
      expect(result).toBeCloseTo(2, 10);
    });

    it('TC-011: log2(8) 应该返回 3', () => {
      const result = engine.log2(8);
      expect(result).toBeCloseTo(3, 10);
    });

    it('TC-012: 负数对数应该抛出错误', () => {
      expect(() => engine.ln(-5)).toThrow();
    });
  });

  describe('指数函数', () => {
    it('TC-013: exp(1) 应该返回 e', () => {
      const result = engine.exp(1);
      expect(result).toBeCloseTo(Math.E, 10);
    });

    it('TC-014: pow10(2) 应该返回 100', () => {
      const result = engine.pow10(2);
      expect(result).toBeCloseTo(100, 10);
    });

    it('TC-015: power(2, 3) 应该返回 8', () => {
      const result = engine.power(2, 3);
      expect(result).toBeCloseTo(8, 10);
    });
  });

  describe('根式函数', () => {
    it('TC-016: sqrt(16) 应该返回 4', () => {
      const result = engine.sqrt(16);
      expect(result).toBeCloseTo(4, 10);
    });

    it('TC-017: cbrt(27) 应该返回 3', () => {
      const result = engine.cbrt(27);
      expect(result).toBeCloseTo(3, 10);
    });

    it('TC-018: 负数平方根应该抛出错误', () => {
      expect(() => engine.sqrt(-4)).toThrow();
    });
  });

  describe('其他数学函数', () => {
    it('TC-019: factorial(5) 应该返回 120', () => {
      const result = engine.factorial(5);
      expect(result).toBe(120);
    });

    it('TC-020: factorial(0) 应该返回 1', () => {
      const result = engine.factorial(0);
      expect(result).toBe(1);
    });

    it('TC-021: reciprocal(4) 应该返回 0.25', () => {
      const result = engine.reciprocal(4);
      expect(result).toBeCloseTo(0.25, 10);
    });

    it('TC-022: absolute(-5) 应该返回 5', () => {
      const result = engine.absolute(-5);
      expect(result).toBe(5);
    });
  });

  describe('角度转换', () => {
    it('TC-023: 180° 应该等于 π 弧度', () => {
      const result = engine.toRadians(180, AngleMode.DEGREE);
      expect(result).toBeCloseTo(Math.PI, 10);
    });

    it('TC-024: 200 GRAD 应该等于 π 弧度', () => {
      const result = engine.toRadians(200, AngleMode.GRADIAN);
      expect(result).toBeCloseTo(Math.PI, 10);
    });
  });

  describe('边界测试', () => {
    it('TC-025: asin(1.5) 应该抛出定义域错误', () => {
      expect(() => engine.asin(1.5, AngleMode.DEGREE)).toThrow();
    });

    it('TC-026: 除零应该抛出错误', () => {
      expect(() => engine.reciprocal(0)).toThrow();
    });

    it('TC-027: 负数阶乘应该抛出错误', () => {
      expect(() => engine.factorial(-1)).toThrow();
    });
  });
});
