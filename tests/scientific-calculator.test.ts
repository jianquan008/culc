import { describe, it, expect } from 'vitest';
import { ScientificEngine, AngleMode } from '../src/services/scientific-engine';

describe('科学计算器自动化测试', () => {
  const engine = new ScientificEngine();

  describe('TC-01: 三角函数测试', () => {
    it('TC-01-01: sin(30°) = 0.5', () => {
      expect(engine.sin(30, AngleMode.DEGREE)).toBeCloseTo(0.5, 10);
    });

    it('TC-01-02: cos(60°) = 0.5', () => {
      expect(engine.cos(60, AngleMode.DEGREE)).toBeCloseTo(0.5, 10);
    });

    it('TC-01-03: tan(45°) = 1', () => {
      expect(engine.tan(45, AngleMode.DEGREE)).toBeCloseTo(1, 10);
    });

    it('TC-01-04: sin(π/6 rad) = 0.5', () => {
      expect(engine.sin(Math.PI / 6, AngleMode.RADIAN)).toBeCloseTo(0.5, 10);
    });
  });

  describe('TC-03: 对数指数测试', () => {
    it('TC-03-01: ln(e) = 1', () => {
      expect(engine.ln(Math.E)).toBeCloseTo(1, 10);
    });

    it('TC-03-02: log(100) = 2', () => {
      expect(engine.log(100)).toBeCloseTo(2, 10);
    });

    it('TC-03-03: 负数对数抛出错误', () => {
      expect(() => engine.ln(-10)).toThrow();
    });

    it('TC-03-04: e^1 = e', () => {
      expect(engine.exp(1)).toBeCloseTo(Math.E, 10);
    });
  });

  describe('TC-04: 数学常数测试', () => {
    it('TC-04-01: π常数精度', () => {
      expect(Math.PI).toBeCloseTo(3.141592653589793, 15);
    });

    it('TC-04-02: e常数精度', () => {
      expect(Math.E).toBeCloseTo(2.718281828459045, 15);
    });
  });

  describe('TC-10: 精度测试', () => {
    it('TC-10-02: 角度转换精度 sin(180°) ≈ 0', () => {
      const result = engine.sin(180, AngleMode.DEGREE);
      expect(Math.abs(result)).toBeLessThan(1e-10);
    });
  });
});
