import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalculatorState, HistoryItem } from '../../types/calculator';
import { CalculatorEngine } from '../../services/calculator-engine';
import { InputHandler } from '../../services/input-handler';
import { StorageService } from '../../services/storage';
import { ScientificEngine, AngleMode } from '../../services/scientific-engine';

const initialState: CalculatorState = {
  display: '0',
  expression: '',
  currentValue: 0,
  previousValue: 0,
  operator: null,
  waitingForOperand: false,
  history: [],
  isError: false,
  errorMessage: '',
  // Scientific calculator extensions
  isScientificMode: false,
  angleMode: 'DEG',
  memory: [0],
  lastFunction: null,
  useScientificNotation: false
};

const calculatorEngine = new CalculatorEngine();
const inputHandler = new InputHandler();
const storageService = new StorageService();
const scientificEngine = new ScientificEngine();

export const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    inputNumber: (state, action: PayloadAction<string>) => {
      if (state.waitingForOperand) {
        state.display = action.payload;
        state.waitingForOperand = false;
      } else {
        state.display = inputHandler.handleNumberInput(state.display, action.payload);
      }
      state.isError = false;
    },

    inputDecimal: (state) => {
      if (state.waitingForOperand) {
        state.display = '0.';
        state.waitingForOperand = false;
      } else {
        state.display = inputHandler.handleDecimalInput(state.display);
      }
    },

    inputOperator: (state, action: PayloadAction<string>) => {
      const newState = inputHandler.handleOperatorInput(state, action.payload);
      Object.assign(state, newState);
    },

    calculate: (state) => {
      if (state.operator && state.previousValue !== null) {
        const expression = `${state.previousValue} ${state.operator} ${state.display}`;
        const result = calculatorEngine.calculate(expression);
        
        if (result.isError) {
          state.isError = true;
          state.errorMessage = result.errorMessage || 'Error';
          state.display = 'Error';
        } else {
          state.display = result.formatted;
          state.currentValue = result.value;
          state.previousValue = 0;
          state.operator = null;
          state.waitingForOperand = true;
          
          // Save to history
          const historyItem: HistoryItem = {
            id: Date.now().toString(),
            expression,
            result: result.formatted,
            timestamp: Date.now(),
            isError: false
          };
          
          state.history.unshift(historyItem);
          if (state.history.length > 10) {
            state.history.splice(10);
          }
          
          storageService.saveHistory(historyItem);
        }
      }
    },

    clear: (state, action: PayloadAction<'C' | 'AC'>) => {
      const newState = inputHandler.handleClear(action.payload, state);
      Object.assign(state, newState);
    },

    loadHistory: (state) => {
      state.history = storageService.getHistory();
    },

    loadHistoryItem: (state, action: PayloadAction<string>) => {
      const item = state.history.find(h => h.id === action.payload);
      if (item) {
        state.expression = item.expression;
        state.display = item.result;
        state.waitingForOperand = true;
      }
    },

    clearHistory: (state) => {
      state.history = [];
      storageService.clearHistory();
    },

    // Scientific calculator actions
    toggleScientificMode: (state) => {
      state.isScientificMode = !state.isScientificMode;
    },

    setAngleMode: (state, action: PayloadAction<'DEG' | 'RAD' | 'GRAD'>) => {
      state.angleMode = action.payload;
    },

    executeScientificFunction: (state, action: PayloadAction<{ func: string; value: number }>) => {
      const { func, value } = action.payload;
      state.lastFunction = func;
      
      try {
        let result: number;
        const angleMode = state.angleMode as AngleMode;
        
        switch (func) {
          case 'sin':
            result = scientificEngine.sin(value, angleMode);
            break;
          case 'cos':
            result = scientificEngine.cos(value, angleMode);
            break;
          case 'tan':
            result = scientificEngine.tan(value, angleMode);
            break;
          case 'asin':
            result = scientificEngine.asin(value, angleMode);
            break;
          case 'acos':
            result = scientificEngine.acos(value, angleMode);
            break;
          case 'atan':
            result = scientificEngine.atan(value, angleMode);
            break;
          case 'sinh':
            result = scientificEngine.sinh(value);
            break;
          case 'cosh':
            result = scientificEngine.cosh(value);
            break;
          case 'tanh':
            result = scientificEngine.tanh(value);
            break;
          case 'ln':
            result = scientificEngine.ln(value);
            break;
          case 'log':
            result = scientificEngine.log(value);
            break;
          case 'log2':
            result = scientificEngine.log2(value);
            break;
          case 'exp':
            result = scientificEngine.exp(value);
            break;
          case 'pow10':
            result = scientificEngine.pow10(value);
            break;
          case 'sqrt':
            result = scientificEngine.sqrt(value);
            break;
          case 'cbrt':
            result = scientificEngine.cbrt(value);
            break;
          case 'square':
            result = scientificEngine.power(value, 2);
            break;
          case 'factorial':
            result = scientificEngine.factorial(value);
            break;
          case 'reciprocal':
            result = scientificEngine.reciprocal(value);
            break;
          case 'absolute':
            result = scientificEngine.absolute(value);
            break;
          case 'percentage':
            result = scientificEngine.percentage(value);
            break;
          default:
            throw new Error(`Unknown function: ${func}`);
        }
        
        state.display = result.toString();
        state.waitingForOperand = true;
        state.isError = false;
        state.errorMessage = '';
        
      } catch (error) {
        state.isError = true;
        state.errorMessage = error instanceof Error ? error.message : 'Calculation error';
        state.display = 'Error';
      }
    },

    memoryStore: (state, action: PayloadAction<{ value: number; slot?: number }>) => {
      const { value, slot = 0 } = action.payload;
      while (state.memory.length <= slot) {
        state.memory.push(0);
      }
      state.memory[slot] = value;
    },

    memoryRecall: (state, action: PayloadAction<{ slot?: number }>) => {
      const { slot = 0 } = action.payload;
      if (state.memory[slot] !== undefined) {
        state.display = state.memory[slot].toString();
        state.waitingForOperand = true;
      }
    },

    memoryAdd: (state, action: PayloadAction<{ value: number; slot?: number }>) => {
      const { value, slot = 0 } = action.payload;
      while (state.memory.length <= slot) {
        state.memory.push(0);
      }
      state.memory[slot] += value;
    },

    memorySubtract: (state, action: PayloadAction<{ value: number; slot?: number }>) => {
      const { value, slot = 0 } = action.payload;
      while (state.memory.length <= slot) {
        state.memory.push(0);
      }
      state.memory[slot] -= value;
    },

    memoryClear: (state, action: PayloadAction<{ slot?: number }>) => {
      const { slot = 0 } = action.payload;
      if (state.memory[slot] !== undefined) {
        state.memory[slot] = 0;
      }
    },

    insertConstant: (state, action: PayloadAction<string>) => {
      const constants: Record<string, number> = {
        PI: Math.PI,
        E: Math.E,
        PHI: (1 + Math.sqrt(5)) / 2
      };
      
      const value = constants[action.payload];
      if (value !== undefined) {
        state.display = value.toString();
        state.waitingForOperand = true;
      }
    },

    // 键盘快捷键相关actions
    copyResult: (state) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(state.display);
      }
    },
    
    pasteValue: (state, action: PayloadAction<string>) => {
      const value = action.payload;
      if (value && /^\d*\.?\d*$/.test(value)) {
        state.display = value;
        state.previousValue = 0;
        state.operator = null;
        state.waitingForOperand = false;
        state.isError = false;
        state.errorMessage = '';
      }
    },

    deleteLast: (state) => {
      if (state.display.length > 1) {
        state.display = state.display.slice(0, -1);
      } else {
        state.display = '0';
      }
      state.isError = false;
    }
  }
});

export const {
  inputNumber,
  inputDecimal,
  inputOperator,
  calculate,
  clear,
  loadHistory,
  loadHistoryItem,
  clearHistory,
  toggleScientificMode,
  setAngleMode,
  executeScientificFunction,
  memoryStore,
  memoryRecall,
  memoryAdd,
  memorySubtract,
  memoryClear,
  insertConstant,
  copyResult,
  pasteValue,
  deleteLast
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
