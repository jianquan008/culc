import React from 'react';
import { ButtonType } from '../../types/calculator';
import { ShortcutTooltip } from '../ShortcutTooltip/ShortcutTooltip';
import './Button.css';

interface ButtonProps {
  value: string;
  type: ButtonType;
  onClick: (value: string) => void;
  disabled?: boolean;
  shortcut?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  value, 
  type, 
  onClick, 
  disabled = false,
  shortcut 
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick(value);
    }
  };

  return (
    <ShortcutTooltip shortcut={shortcut}>
      <button
        className={`button button--${type}`}
        onClick={handleClick}
        disabled={disabled}
        data-key={shortcut}
      >
        {value}
      </button>
    </ShortcutTooltip>
  );
};
