import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  setFormulas, 
  setCategories, 
  setSelectedCategory, 
  setSearchQuery,
  togglePanelVisibility 
} from '../../store/slices/formulaSlice';
import { FormulaManager } from '../../services/formulaManager';
import { FormulaList } from './FormulaList';
import { CategoryTabs } from './CategoryTabs';
import { SearchInput } from './SearchInput';
import './FormulaPanel.css';

interface FormulaPanelProps {
  visible: boolean;
  onToggle: () => void;
}

const formulaManager = new FormulaManager();

export const FormulaPanel: React.FC<FormulaPanelProps> = ({ visible, onToggle }) => {
  const dispatch = useDispatch();
  const { 
    filteredFormulas, 
    categories, 
    selectedCategory, 
    searchQuery 
  } = useSelector((state: RootState) => state.formula);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await formulaManager.initialize();
        const [formulas, cats] = await Promise.all([
          formulaManager.getFormulas(),
          formulaManager.getCategories()
        ]);
        dispatch(setFormulas(formulas));
        dispatch(setCategories(cats));
      } catch (error) {
        console.error('Failed to initialize formula data:', error);
      }
    };

    initializeData();
  }, [dispatch]);

  const handleCategoryChange = (categoryId: string) => {
    dispatch(setSelectedCategory(categoryId));
  };

  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleFormulaUse = async (formula: any) => {
    // 增加使用次数
    await formulaManager.incrementUsage(formula.id);
    // 填入计算器
    // TODO: 集成到计算器
  };

  return (
    <div className={`formula-panel ${visible ? 'visible' : ''}`}>
      <div className="formula-panel-header">
        <h3>公式收藏</h3>
        <button className="close-btn" onClick={onToggle}>×</button>
      </div>
      
      <SearchInput 
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="搜索公式..."
      />
      
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      <FormulaList
        formulas={filteredFormulas}
        onFormulaUse={handleFormulaUse}
      />
    </div>
  );
};
