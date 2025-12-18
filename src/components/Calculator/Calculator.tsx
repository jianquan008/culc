import React, { useEffect, useCallback } from 'react';
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
import { Display } from '../Display/Display';
import { ButtonPanel } from '../ButtonPanel/ButtonPanel';
import { History } from '../History/History';
import { ModeToggle } from '../ModeToggle/ModeToggle';
import { AngleModeSelector } from '../AngleModeSelector/AngleModeSelector';
import { ScientificButtonPanel } from '../ScientificButtonPanel/ScientificButtonPanel';
import { ThemeToggle } from '../ThemeToggle';
import { FUNCTIONS, OPERATORS } from '../../constants/calculator';
import './Calculator.css';

export const Calculator: React.FC = () => {
  const dispatch = useDispatch();
  const { display, expression, isError, isScientificMode } = useSelector((state: RootState) => state.calculator);

  useEffect(() => {
    dispatch(loadHistory());
  }, [dispatch]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    
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
      dispatch(calculate());
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

  const handleNumberClick = (digit: string) => {
    dispatch(inputNumber(digit));
  };

  const handleOperatorClick = (operator: string) => {
    dispatch(inputOperator(operator));
  };

  const handleFunctionClick = (func: string) => {
    switch (func) {
      case FUNCTIONS.EQUALS:
        dispatch(calculate());
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

  return (
    <div className="calculator">
      <div className="calculator-header">
        <ModeToggle />
        <ThemeToggle />
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
    </div>
  );
};
