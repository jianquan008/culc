export interface CalculatorState {
  display: string;
  expression: string;
  currentValue: number;
  previousValue: number;
  operator: string | null;
  waitingForOperand: boolean;
  history: HistoryItem[];
  isError: boolean;
  errorMessage: string;
}

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  isError: boolean;
}

export interface CalculationResult {
  value: number;
  formatted: string;
  isError: boolean;
  errorMessage?: string;
}

export interface Token {
  type: 'number' | 'operator' | 'function';
  value: string | number;
  precedence?: number;
}

export enum CalculatorError {
  DIVISION_BY_ZERO = 'DIVISION_BY_ZERO',
  INVALID_EXPRESSION = 'INVALID_EXPRESSION',
  NUMBER_OVERFLOW = 'NUMBER_OVERFLOW',
  INVALID_INPUT = 'INVALID_INPUT'
}

export type ButtonType = 'number' | 'operator' | 'function' | 'equals';
