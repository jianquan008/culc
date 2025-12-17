import { CalculatorState } from '../types/calculator';
import { OPERATORS, MAX_DISPLAY_LENGTH } from '../constants/calculator';

export class InputHandler {
  handleNumberInput(current: string, digit: string): string {
    if (current === '0' && digit !== '.') {
      return digit;
    }
    if (current.length >= MAX_DISPLAY_LENGTH) {
      return current;
    }
    return current + digit;
  }

  handleDecimalInput(current: string): string {
    if (current.includes('.')) {
      return current;
    }
    if (current === '' || current === '0') {
      return '0.';
    }
    return current + '.';
  }

  handleOperatorInput(state: CalculatorState, operator: string): CalculatorState {
    const { display, previousValue, operator: currentOperator, waitingForOperand } = state;
    
    if (waitingForOperand) {
      return {
        ...state,
        operator,
        waitingForOperand: false
      };
    }

    const inputValue = parseFloat(display);

    if (currentOperator === null) {
      return {
        ...state,
        previousValue: inputValue,
        operator,
        waitingForOperand: true
      };
    }

    if (currentOperator) {
      const result = this.calculate(previousValue, inputValue, currentOperator);
      return {
        ...state,
        display: String(result),
        previousValue: result,
        currentValue: result,
        operator,
        waitingForOperand: true
      };
    }

    return state;
  }

  handleClear(type: 'C' | 'AC', state: CalculatorState): CalculatorState {
    if (type === 'AC') {
      return {
        ...state,
        display: '0',
        expression: '',
        currentValue: 0,
        previousValue: 0,
        operator: null,
        waitingForOperand: false,
        isError: false,
        errorMessage: ''
      };
    }

    return {
      ...state,
      display: '0',
      waitingForOperand: false
    };
  }

  validateInput(input: string, currentState: CalculatorState): boolean {
    if (currentState.isError) return false;
    
    if (/\d/.test(input)) return true;
    if (input === '.' && !currentState.display.includes('.')) return true;
    if (Object.values(OPERATORS).includes(input as any)) return true;
    
    return false;
  }

  private calculate(firstValue: number, secondValue: number, operator: string): number {
    switch (operator) {
      case OPERATORS.ADD:
        return firstValue + secondValue;
      case OPERATORS.SUBTRACT:
        return firstValue - secondValue;
      case OPERATORS.MULTIPLY:
        return firstValue * secondValue;
      case OPERATORS.DIVIDE:
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  }
}
