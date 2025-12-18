import { configureStore } from '@reduxjs/toolkit';
import calculatorReducer from './slices/calculatorSlice';
import themeReducer from './slices/themeSlice';
import historyReducer from './slices/historySlice';
import formulaReducer from './slices/formulaSlice';

export const store = configureStore({
  reducer: {
    calculator: calculatorReducer,
    theme: themeReducer,
    history: historyReducer,
    formula: formulaReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
