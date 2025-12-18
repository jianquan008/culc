import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toggleTheme } from '../../store/slices/themeSlice';
import './ThemeToggle.css';

export const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state: RootState) => state.theme);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button 
      className="theme-toggle" 
      onClick={handleToggle}
      aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} theme`}
    >
      <span className={`theme-toggle-icon ${mode === 'light' ? 'sun' : 'moon'}`}>
        {mode === 'light' ? '☀️' : '🌙'}
      </span>
    </button>
  );
};
