import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Formula, Category } from '../../types/formula';

interface FormulaState {
  formulas: Formula[];
  categories: Category[];
  selectedCategory: string;
  searchQuery: string;
  filteredFormulas: Formula[];
  isLoading: boolean;
  isPanelVisible: boolean;
  sortBy: 'name' | 'usage' | 'date';
  sortOrder: 'asc' | 'desc';
}

const initialState: FormulaState = {
  formulas: [],
  categories: [],
  selectedCategory: 'all',
  searchQuery: '',
  filteredFormulas: [],
  isLoading: false,
  isPanelVisible: false,
  sortBy: 'date',
  sortOrder: 'desc'
};

const updateFilteredFormulas = (state: FormulaState) => {
  let filtered = [...state.formulas];
  
  // 分类过滤
  if (state.selectedCategory !== 'all') {
    filtered = filtered.filter(f => f.category === state.selectedCategory);
  }
  
  // 搜索过滤
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(f => 
      f.name.toLowerCase().includes(query) ||
      f.formula.toLowerCase().includes(query) ||
      f.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  // 排序
  filtered.sort((a, b) => {
    let comparison = 0;
    switch (state.sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'usage':
        comparison = a.usageCount - b.usageCount;
        break;
      case 'date':
        comparison = a.updatedAt - b.updatedAt;
        break;
    }
    return state.sortOrder === 'asc' ? comparison : -comparison;
  });
  
  state.filteredFormulas = filtered;
};

export const formulaSlice = createSlice({
  name: 'formula',
  initialState,
  reducers: {
    setFormulas: (state, action: PayloadAction<Formula[]>) => {
      state.formulas = action.payload;
      updateFilteredFormulas(state);
    },
    
    addFormula: (state, action: PayloadAction<Formula>) => {
      state.formulas.unshift(action.payload);
      updateFilteredFormulas(state);
    },
    
    updateFormula: (state, action: PayloadAction<{id: string, updates: Partial<Formula>}>) => {
      const index = state.formulas.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.formulas[index] = { ...state.formulas[index], ...action.payload.updates };
        updateFilteredFormulas(state);
      }
    },
    
    deleteFormula: (state, action: PayloadAction<string>) => {
      state.formulas = state.formulas.filter(f => f.id !== action.payload);
      updateFilteredFormulas(state);
    },
    
    incrementUsage: (state, action: PayloadAction<string>) => {
      const formula = state.formulas.find(f => f.id === action.payload);
      if (formula) {
        formula.usageCount += 1;
        formula.lastUsedAt = Date.now();
        updateFilteredFormulas(state);
      }
    },
    
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    
    updateCategory: (state, action: PayloadAction<{id: string, updates: Partial<Category>}>) => {
      const index = state.categories.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = { ...state.categories[index], ...action.payload.updates };
      }
    },
    
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      updateFilteredFormulas(state);
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      updateFilteredFormulas(state);
    },
    
    togglePanelVisibility: (state) => {
      state.isPanelVisible = !state.isPanelVisible;
    },
    
    setPanelVisible: (state, action: PayloadAction<boolean>) => {
      state.isPanelVisible = action.payload;
    },
    
    setSortOptions: (state, action: PayloadAction<{sortBy: 'name' | 'usage' | 'date', sortOrder: 'asc' | 'desc'}>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
      updateFilteredFormulas(state);
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const {
  setFormulas,
  addFormula,
  updateFormula,
  deleteFormula,
  incrementUsage,
  setCategories,
  addCategory,
  updateCategory,
  setSelectedCategory,
  setSearchQuery,
  togglePanelVisibility,
  setPanelVisible,
  setSortOptions,
  setLoading
} = formulaSlice.actions;

export default formulaSlice.reducer;
