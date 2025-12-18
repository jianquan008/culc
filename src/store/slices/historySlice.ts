import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HistoryItem } from '../../types/calculator';

interface HistoryState {
  items: HistoryItem[];
  searchQuery: string;
  isVisible: boolean;
}

const initialState: HistoryState = {
  items: [],
  searchQuery: '',
  isVisible: false
};

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistoryItem: (state, action: PayloadAction<Omit<HistoryItem, 'id'>>) => {
      const newItem: HistoryItem = {
        ...action.payload,
        id: Date.now().toString()
      };
      state.items.unshift(newItem);
      if (state.items.length > 50) {
        state.items = state.items.slice(0, 50);
      }
    },
    
    deleteHistoryItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    
    clearHistory: (state) => {
      state.items = [];
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    toggleHistoryPanel: (state) => {
      state.isVisible = !state.isVisible;
    },
    
    loadHistory: (state, action: PayloadAction<HistoryItem[]>) => {
      state.items = action.payload;
    }
  }
});

export const {
  addHistoryItem,
  deleteHistoryItem,
  clearHistory,
  setSearchQuery,
  toggleHistoryPanel,
  loadHistory
} = historySlice.actions;

export default historySlice.reducer;
