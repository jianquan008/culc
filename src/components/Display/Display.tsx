import React from 'react';
import './Display.css';

interface DisplayProps {
  value: string;
  expression: string;
  isError: boolean;
}

export const Display: React.FC<DisplayProps> = ({ value, expression, isError }) => {
  return (
    <div className="display">
      {expression && (
        <div className="display__expression">{expression}</div>
      )}
      <div className={`display__main ${isError ? 'display__main--error' : ''}`}>
        {value}
      </div>
    </div>
  );
};
