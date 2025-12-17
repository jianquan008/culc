import { describe, it, expect } from 'vitest';
import { InputHandler } from '../../src/services/input-handler';
import { CalculatorState } from '../../src/types/calculator';

describe('InputHandler', () => {
  let handler: InputHandler;
  let mockState: CalculatorState;

  beforeEach(() => {
    handler = new InputHandler();
    mockState = {
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
  });

  describe('数字输入处理', () => {
    it('应该替换初始的0', () => {
      const result = handler.handleNumberInput('0', '5');
      expect(result).toBe('5');
    });

    it('应该追加数字到现有数字', () => {
      const result = handler.handleNumberInput('12', '3');
      expect(result).toBe('123');
    });

    it('应该限制最大显示长度', () => {
      const longNumber = '123456789012';
      const result = handler.handleNumberInput(longNumber, '3');
      expect(result).toBe(longNumber);
    });
  });

  describe('小数点输入处理', () => {
    it('应该在空字符串后添加0.', () => {
      const result = handler.handleDecimalInput('');
      expect(result).toBe('0.');
    });

    it('应该在0后添加小数点', () => {
      const result = handler.handleDecimalInput('0');
      expect(result).toBe('0.');
    });

    it('应该防止重复小数点', () => {
      const result = handler.handleDecimalInput('3.14');
      expect(result).toBe('3.14');
    });

    it('应该在整数后添加小数点', () => {
      const result = handler.handleDecimalInput('123');
      expect(result).toBe('123.');
    });
  });

  describe('清除操作处理', () => {
    it('C键应该只清除显示', () => {
      const state = { ...mockState, display: '123', previousValue: 456 };
      const result = handler.handleClear('C', state);
      expect(result.display).toBe('0');
      expect(result.previousValue).toBe(456);
    });

    it('AC键应该重置所有状态', () => {
      const state = { 
        ...mockState, 
        display: '123', 
        previousValue: 456, 
        operator: '+',
        isError: true 
      };
      const result = handler.handleClear('AC', state);
      expect(result.display).toBe('0');
      expect(result.previousValue).toBe(0);
      expect(result.operator).toBe(null);
      expect(result.isError).toBe(false);
    });
  });

  describe('输入验证', () => {
    it('应该接受数字输入', () => {
      const result = handler.validateInput('5', mockState);
      expect(result).toBe(true);
    });

    it('应该接受小数点输入', () => {
      const result = handler.validateInput('.', mockState);
      expect(result).toBe(true);
    });

    it('应该拒绝错误状态下的输入', () => {
      const errorState = { ...mockState, isError: true };
      const result = handler.validateInput('5', errorState);
      expect(result).toBe(false);
    });
  });
});
