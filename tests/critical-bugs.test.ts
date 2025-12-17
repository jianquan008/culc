import { describe, it, expect } from 'vitest';
import { CalculatorEngine } from '../src/services/calculator-engine';
import { InputHandler } from '../src/services/input-handler';
import { CalculatorState } from '../src/types/calculator';

describe('Critical Bug Tests', () => {
  let engine: CalculatorEngine;
  let handler: InputHandler;

  beforeEach(() => {
    engine = new CalculatorEngine();
    handler = new InputHandler();
  });

  describe('零值计算问题', () => {
    it('应该能够计算 0 + 5', () => {
      const result = engine.calculate('0 + 5');
      expect(result.value).toBe(5);
      expect(result.isError).toBe(false);
    });

    it('应该能够计算 0 × 5', () => {
      const result = engine.calculate('0 × 5');
      expect(result.value).toBe(0);
      expect(result.isError).toBe(false);
    });

    it('应该能够计算 5 - 0', () => {
      const result = engine.calculate('5 - 0');
      expect(result.value).toBe(5);
      expect(result.isError).toBe(false);
    });
  });

  describe('运算符兼容性问题', () => {
    it('应该支持 * 符号', () => {
      const result = engine.calculate('3 * 4');
      expect(result.value).toBe(12);
      expect(result.isError).toBe(false);
    });

    it('应该支持 / 符号', () => {
      const result = engine.calculate('8 / 2');
      expect(result.value).toBe(4);
      expect(result.isError).toBe(false);
    });

    it('应该支持混合运算符', () => {
      const result = engine.calculate('2 + 3 * 4');
      expect(result.value).toBe(14);
      expect(result.isError).toBe(false);
    });
  });

  describe('输入处理器零值问题', () => {
    it('应该正确处理以0开始的运算', () => {
      const initialState: CalculatorState = {
        display: '0',
        expression: '',
        currentValue: 0,
        previousValue: 0,
        operator: null,
        waitingForOperand: false,
        history: [],
        isError: false,
        errorMessage: ''
      };

      // 输入运算符
      const result = handler.handleOperatorInput(initialState, '+');
      expect(result.previousValue).toBe(0);
      expect(result.operator).toBe('+');
      expect(result.waitingForOperand).toBe(true);
    });
  });

  describe('连续运算问题', () => {
    it('应该正确处理连续运算', () => {
      let state: CalculatorState = {
        display: '2',
        expression: '',
        currentValue: 0,
        previousValue: 0,
        operator: null,
        waitingForOperand: false,
        history: [],
        isError: false,
        errorMessage: ''
      };

      // 2 +
      state = handler.handleOperatorInput(state, '+');
      expect(state.previousValue).toBe(2);
      expect(state.operator).toBe('+');

      // 3 +
      state.display = '3';
      state.waitingForOperand = false;
      state = handler.handleOperatorInput(state, '+');
      expect(state.previousValue).toBe(5); // 2 + 3 = 5
      expect(state.operator).toBe('+');
    });
  });
});
