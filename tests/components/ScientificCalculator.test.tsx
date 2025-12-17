import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import calculatorReducer from '../../src/store/slices/calculatorSlice';

const createTestStore = () => {
  return configureStore({
    reducer: {
      calculator: calculatorReducer
    }
  });
};

describe('科学计算器组件测试', () => {
  it('TC-028: 应该能够切换到科学模式', () => {
    const store = createTestStore();
    
    // 切换到科学模式
    store.dispatch({ type: 'calculator/toggleScientificMode' });
    
    const state = store.getState();
    expect(state.calculator.isScientificMode).toBe(true);
  });

  it('TC-029: 应该能够切换角度模式', () => {
    const store = createTestStore();
    
    // 设置为科学模式
    store.dispatch({ type: 'calculator/toggleScientificMode' });
    
    // 切换到弧度模式
    store.dispatch({ type: 'calculator/setAngleMode', payload: 'RAD' });
    
    const state = store.getState();
    expect(state.calculator.angleMode).toBe('RAD');
  });

  it('TC-030: 应该能够执行三角函数计算 sin(30°)', () => {
    const store = createTestStore();
    
    // 设置为科学模式和度模式
    store.dispatch({ type: 'calculator/toggleScientificMode' });
    store.dispatch({ type: 'calculator/setAngleMode', payload: 'DEG' });
    
    // 执行sin(30)函数
    store.dispatch({ 
      type: 'calculator/executeScientificFunction', 
      payload: { func: 'sin', value: 30 } 
    });
    
    const state = store.getState();
    const result = parseFloat(state.calculator.display);
    expect(result).toBeCloseTo(0.5, 5);
  });

  it('TC-031: 应该能够使用数学常数 π', () => {
    const store = createTestStore();
    
    // 设置为科学模式
    store.dispatch({ type: 'calculator/toggleScientificMode' });
    
    // 插入π常数
    store.dispatch({ type: 'calculator/insertConstant', payload: 'PI' });
    
    const state = store.getState();
    const result = parseFloat(state.calculator.display);
    expect(result).toBeCloseTo(Math.PI, 10);
  });

  it('TC-032: 应该能够执行对数计算 ln(e)', () => {
    const store = createTestStore();
    
    // 设置为科学模式
    store.dispatch({ type: 'calculator/toggleScientificMode' });
    
    // 执行ln(e)
    store.dispatch({ 
      type: 'calculator/executeScientificFunction', 
      payload: { func: 'ln', value: Math.E } 
    });
    
    const state = store.getState();
    const result = parseFloat(state.calculator.display);
    expect(result).toBeCloseTo(1, 10);
  });

  it('TC-033: 应该能够执行平方根计算 √16', () => {
    const store = createTestStore();
    
    // 设置为科学模式
    store.dispatch({ type: 'calculator/toggleScientificMode' });
    
    // 执行sqrt(16)
    store.dispatch({ 
      type: 'calculator/executeScientificFunction', 
      payload: { func: 'sqrt', value: 16 } 
    });
    
    const state = store.getState();
    const result = parseFloat(state.calculator.display);
    expect(result).toBeCloseTo(4, 10);
  });

  it('TC-034: 应该能够执行阶乘计算 5!', () => {
    const store = createTestStore();
    
    // 设置为科学模式
    store.dispatch({ type: 'calculator/toggleScientificMode' });
    
    // 执行factorial(5)
    store.dispatch({ 
      type: 'calculator/executeScientificFunction', 
      payload: { func: 'factorial', value: 5 } 
    });
    
    const state = store.getState();
    const result = parseFloat(state.calculator.display);
    expect(result).toBe(120);
  });
});
