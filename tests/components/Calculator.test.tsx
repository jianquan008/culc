import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Calculator } from '../../src/components/Calculator/Calculator';
import calculatorReducer from '../../src/store/slices/calculatorSlice';

const createTestStore = () => {
  return configureStore({
    reducer: {
      calculator: calculatorReducer
    }
  });
};

const renderWithProvider = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('Calculator Component', () => {
  it('应该渲染计算器界面', () => {
    renderWithProvider(<Calculator />);
    
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '=' })).toBeInTheDocument();
    expect(screen.getByText('History (0)')).toBeInTheDocument();
  });

  it('应该处理数字输入', () => {
    const { container } = renderWithProvider(<Calculator />);
    
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    // 使用CSS选择器查找显示区域的内容
    const displayElement = container.querySelector('.display__main');
    expect(displayElement).toHaveTextContent('5');
  });

  it('应该处理基本运算', () => {
    const { container } = renderWithProvider(<Calculator />);
    
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    
    // 使用CSS选择器查找显示区域的内容
    const displayElement = container.querySelector('.display__main');
    expect(displayElement).toHaveTextContent('5');
  });

  it('应该处理清除操作', () => {
    const { container } = renderWithProvider(<Calculator />);
    
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: 'C' }));
    
    // 使用CSS选择器查找显示区域的内容
    const displayElement = container.querySelector('.display__main');
    expect(displayElement).toHaveTextContent('0');
  });
});
