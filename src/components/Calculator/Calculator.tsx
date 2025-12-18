import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  inputNumber, 
  inputDecimal, 
  inputOperator, 
  calculate, 
  clear, 
  loadHistory 
} from '../../store/slices/calculatorSlice';
import { addHistoryItem, toggleHistoryPanel } from '../../store/slices/historySlice';
import { Display } from '../Display/Display';
import { ButtonPanel } from '../ButtonPanel/ButtonPanel';
import { History } from '../History/History';
import { HistoryPanel } from '../History/HistoryPanel';
import { ModeToggle } from '../ModeToggle/ModeToggle';
import { AngleModeSelector } from '../AngleModeSelector/AngleModeSelector';
import { ScientificButtonPanel } from '../ScientificButtonPanel/ScientificButtonPanel';
import { ThemeToggle } from '../ThemeToggle';
import { useHistoryPersistence } from '../../hooks/useHistoryPersistence';
import { FUNCTIONS, OPERATORS } from '../../constants/calculator';
import { HistoryItem } from '../../types/calculator';
import './Calculator.css';

export const Calculator: React.FC = () => {
  const dispatch = useDispatch();
  const { display, expression, isError, isScientificMode } = useSelector((state: RootState) => state.calculator);
  const { isVisible } = useSelector((state: RootState) => state.history);
  const [lastExpression, setLastExpression] = useState('');

  useHistoryPersistence();

  useEffect(() => {
    dispatch(loadHistory());
  }, [dispatch]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const { key, ctrlKey } = event;
    
    if (ctrlKey && key === 'h') {
      event.preventDefault();
      dispatch(toggleHistoryPanel());
      return;
    }
    
    if (/[0-9]/.test(key)) {
      dispatch(inputNumber(key));
    } else if (key === '.') {
      dispatch(inputDecimal());
    } else if (key === '+') {
      dispatch(inputOperator(OPERATORS.ADD));
    } else if (key === '-') {
      dispatch(inputOperator(OPERATORS.SUBTRACT));
    } else if (key === '*') {
      dispatch(inputOperator(OPERATORS.MULTIPLY));
    } else if (key === '/') {
      event.preventDefault();
      dispatch(inputOperator(OPERATORS.DIVIDE));
    } else if (key === 'Enter' || key === '=') {
      handleCalculate();
    } else if (key === 'Escape') {
      dispatch(clear('AC'));
    } else if (key === 'Backspace') {
      dispatch(clear('C'));
    }
  }, [dispatch]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleCalculate = () => {
    const currentExpression = expression || display;
    if (currentExpression && currentExpression !== lastExpression) {
      dispatch(calculate());
      setLastExpression(currentExpression);
      
      // 添加到历史记录
      setTimeout(() => {
        const result = display;
        if (!isError && result !== 'Error') {
          dispatch(addHistoryItem({
            expression: currentExpression,
            result: result,
            timestamp: Date.now(),
            isError: false
          }));
        }
      }, 100);
    }
  };

  const handleNumberClick = (digit: string) => {
    dispatch(inputNumber(digit));
  };

  const handleOperatorClick = (operator: string) => {
    dispatch(inputOperator(operator));
  };

  const handleFunctionClick = (func: string) => {
    switch (func) {
      case FUNCTIONS.EQUALS:
        handleCalculate();
        break;
      case FUNCTIONS.CLEAR:
        dispatch(clear('C'));
        break;
      case FUNCTIONS.ALL_CLEAR:
        dispatch(clear('AC'));
        break;
    }
  };

  const handleDecimalClick = () => {
    dispatch(inputDecimal());
  };

  const handleHistoryItemClick = (item: HistoryItem) => {
    dispatch(clear('AC'));
    // 简单地将结果设置为显示值
    dispatch(inputNumber(item.result));
    dispatch(toggleHistoryPanel());
  };

  return (
    <div className="calculator">
      <div className="calculator-header">
        <ModeToggle />
        <div className="header-controls">
          <button 
            className="history-toggle-btn"
            onClick={() => dispatch(toggleHistoryPanel())}
          >
            📋
          </button>
          <ThemeToggle />
        </div>
      </div>
      <Display 
        value={display} 
        expression={expression} 
        isError={isError} 
      />
      {isScientificMode && <AngleModeSelector />}
      {isScientificMode && <ScientificButtonPanel />}
      <ButtonPanel
        onNumberClick={handleNumberClick}
        onOperatorClick={handleOperatorClick}
        onFunctionClick={handleFunctionClick}
        onDecimalClick={handleDecimalClick}
      />
      <History />
      <HistoryPanel 
        isVisible={isVisible}
        onItemClick={handleHistoryItemClick}
      />
    </div>
  );
};
