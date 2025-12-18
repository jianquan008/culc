import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeManager, Theme } from '../../utils/themeManager';

interface ThemeState {
  mode: Theme;
  isAuto: boolean;
  systemTheme: Theme;
}

const initialState: ThemeState = {
  mode: 'light',
  isAuto: true,
  systemTheme: 'light'
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      state.isAuto = false;
      ThemeManager.applyTheme(state.mode);
      ThemeManager.saveTheme(state.mode);
    },
    
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.mode = action.payload;
      state.isAuto = false;
      ThemeManager.applyTheme(state.mode);
      ThemeManager.saveTheme(state.mode);
    },
    
    setAutoTheme: (state, action: PayloadAction<boolean>) => {
      state.isAuto = action.payload;
      if (action.payload) {
        state.mode = state.systemTheme;
        ThemeManager.applyTheme(state.mode);
        ThemeManager.saveTheme('auto');
      }
    },
    
    updateSystemTheme: (state, action: PayloadAction<Theme>) => {
      state.systemTheme = action.payload;
      if (state.isAuto) {
        state.mode = action.payload;
        ThemeManager.applyTheme(state.mode);
      }
    },
    
    initializeTheme: (state) => {
      const savedTheme = ThemeManager.loadTheme();
      const systemTheme = ThemeManager.getSystemTheme();
      
      state.systemTheme = systemTheme;
      
      if (savedTheme === 'auto') {
        state.isAuto = true;
        state.mode = systemTheme;
      } else {
        state.isAuto = false;
        state.mode = savedTheme;
      }
      
      ThemeManager.applyTheme(state.mode);
    }
  }
});

export const { 
  toggleTheme, 
  setTheme, 
  setAutoTheme, 
  updateSystemTheme, 
  initializeTheme 
} = themeSlice.actions;

export default themeSlice.reducer;
