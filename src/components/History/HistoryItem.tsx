import React from 'react';
import { HistoryItem as HistoryItemType } from '../../types/calculator';

interface HistoryItemProps {
  item: HistoryItemType;
  onClick: () => void;
  onDelete: () => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item, onClick, onDelete }) => {
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
  };

  return (
    <div className="history-item" onClick={onClick}>
      <div className="history-item__expression">{item.expression}</div>
      <div className="history-item__result">= {item.result}</div>
      <div className="history-item__footer">
        <span className="history-item__time">{formatTime(item.timestamp)}</span>
        <button 
          className="history-item__delete"
          onClick={(e) => { 
            e.stopPropagation(); 
            onDelete(); 
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};
