import { describe, it, expect } from 'vitest';
import { CalculatorEngine } from '../../src/services/calculator-engine';
import { CalculatorError } from '../../src/types/calculator';

describe('CalculatorEngine', () => {
  let engine: CalculatorEngine;

  beforeEach(() => {
    engine = new CalculatorEngine();
  });

  describe('基本运算', () => {
    it('应该正确执行加法运算', () => {
      const result = engine.calculate('2 + 3');
      expect(result.value).toBe(5);
      expect(result.formatted).toBe('5');
      expect(result.isError).toBe(false);
    });

    it('应该正确执行减法运算', () => {
      const result = engine.calculate('10 - 4');
      expect(result.value).toBe(6);
      expect(result.formatted).toBe('6');
    });

    it('应该正确执行乘法运算', () => {
      const result = engine.calculate('3 × 4');
      expect(result.value).toBe(12);
      expect(result.formatted).toBe('12');
    });

    it('应该正确执行除法运算', () => {
      const result = engine.calculate('15 ÷ 3');
      expect(result.value).toBe(5);
      expect(result.formatted).toBe('5');
    });
  });

  describe('运算优先级', () => {
    it('应该正确处理乘除优先级', () => {
      const result = engine.calculate('2 + 3 × 4');
      expect(result.value).toBe(14);
    });

    it('应该正确处理复杂表达式', () => {
      const result = engine.calculate('10 - 2 × 3 + 8 ÷ 4');
      expect(result.value).toBe(6);
    });
  });

  describe('小数运算', () => {
    it('应该正确处理小数加法', () => {
      const result = engine.calculate('0.1 + 0.2');
      expect(result.value).toBeCloseTo(0.3);
    });

    it('应该正确处理小数除法', () => {
      const result = engine.calculate('1 ÷ 3');
      expect(result.value).toBeCloseTo(0.333333);
    });
  });

  describe('错误处理', () => {
    it('应该处理除零错误', () => {
      const result = engine.calculate('5 ÷ 0');
      expect(result.isError).toBe(true);
      expect(result.formatted).toBe('Error');
    });

    it('应该处理无效表达式', () => {
      const result = engine.calculate('2 + + 3');
      expect(result.isError).toBe(true);
    });
  });

  describe('数字格式化', () => {
    it('应该使用科学计数法显示大数', () => {
      const formatted = engine.formatResult(1e12);
      expect(formatted).toMatch(/e\+/);
    });

    it('应该使用科学计数法显示小数', () => {
      const formatted = engine.formatResult(1e-7);
      expect(formatted).toMatch(/e-/);
    });
  });
});
