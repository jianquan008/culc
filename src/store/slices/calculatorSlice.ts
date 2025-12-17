import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalculatorState, HistoryItem } from '../../types/calculator';
import { CalculatorEngine } from '../../services/calculator-engine';
import { InputHandler } from '../../services/input-handler';
import { StorageService } from '../../services/storage';

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

const calculatorEngine = new CalculatorEngine();
const inputHandler = new InputHandler();
const storageService = new StorageService();

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
  clearHistory
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
