import React from 'react';
import { Formula } from '../../types/formula';

interface FormulaListProps {
  formulas: Formula[];
  onFormulaUse: (formula: Formula) => void;
}

export const FormulaList: React.FC<FormulaListProps> = ({ formulas, onFormulaUse }) => {
  if (formulas.length === 0) {
    return (
      <div className="formula-list-empty">
        <p>暂无公式</p>
        <p>完成计算后点击收藏按钮保存公式</p>
      </div>
    );
  }

  return (
    <div className="formula-list">
      {formulas.map(formula => (
        <div 
          key={formula.id} 
          className="formula-item"
          onClick={() => onFormulaUse(formula)}
        >
          <div className="formula-header">
            <h4 className="formula-name">{formula.name}</h4>
            <span className="formula-usage">{formula.usageCount}次</span>
          </div>
          <div className="formula-expression">{formula.formula}</div>
          <div className="formula-tags">
            {formula.tags.map(tag => (
              <span key={tag} className="formula-tag">{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
