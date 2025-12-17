import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setAngleMode } from '../../store/slices/calculatorSlice';
import './AngleModeSelector.css';

export const AngleModeSelector: React.FC = () => {
  const dispatch = useDispatch();
  const angleMode = useSelector((state: RootState) => state.calculator.angleMode);

  const modes = ['DEG', 'RAD', 'GRAD'] as const;

  return (
    <div className="angle-mode-selector">
      {modes.map(mode => (
        <button
          key={mode}
          className={`angle-mode-button ${angleMode === mode ? 'active' : ''}`}
          onClick={() => dispatch(setAngleMode(mode))}
        >
          {mode}
        </button>
      ))}
    </div>
  );
};
