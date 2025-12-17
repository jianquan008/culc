import React from 'react';
import { ButtonType } from '../../types/calculator';
import './Button.css';

interface ButtonProps {
  value: string;
  type: ButtonType;
  onClick: (value: string) => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ value, type, onClick, disabled = false }) => {
  const handleClick = () => {
    if (!disabled) {
      onClick(value);
    }
  };

  return (
    <button
      className={`button button--${type}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {value}
    </button>
  );
};
