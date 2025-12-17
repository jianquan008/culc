import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toggleScientificMode } from '../../store/slices/calculatorSlice';
import './ModeToggle.css';

export const ModeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const isScientificMode = useSelector((state: RootState) => state.calculator.isScientificMode);

  return (
    <div className="mode-toggle">
      <button
        className={`mode-button ${!isScientificMode ? 'active' : ''}`}
        onClick={() => !isScientificMode || dispatch(toggleScientificMode())}
      >
        Standard
      </button>
      <button
        className={`mode-button ${isScientificMode ? 'active' : ''}`}
        onClick={() => isScientificMode || dispatch(toggleScientificMode())}
      >
        Scientific
      </button>
    </div>
  );
};
