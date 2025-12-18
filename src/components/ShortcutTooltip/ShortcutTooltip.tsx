import React from 'react';
import './ShortcutTooltip.css';

interface ShortcutTooltipProps {
  shortcut?: string;
  children: React.ReactNode;
}

export const ShortcutTooltip: React.FC<ShortcutTooltipProps> = ({ 
  shortcut, 
  children 
}) => {
  if (!shortcut) return <>{children}</>;
  
  return (
    <div 
      className="shortcut-tooltip-container"
      title={`快捷键: ${shortcut}`}
    >
      {children}
      <span className="shortcut-hint">{shortcut}</span>
    </div>
  );
};
