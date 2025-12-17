export const MAX_HISTORY_COUNT = 10;
export const PRECISION = 15;
export const MAX_DISPLAY_LENGTH = 12;

export const OPERATORS = {
  ADD: '+',
  SUBTRACT: '-',
  MULTIPLY: '×',
  DIVIDE: '÷'
} as const;

export const FUNCTIONS = {
  EQUALS: '=',
  CLEAR: 'C',
  ALL_CLEAR: 'AC'
} as const;

export const OPERATOR_PRECEDENCE = {
  [OPERATORS.ADD]: 1,
  [OPERATORS.SUBTRACT]: 1,
  [OPERATORS.MULTIPLY]: 2,
  [OPERATORS.DIVIDE]: 2
} as const;
