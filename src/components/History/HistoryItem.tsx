import React from 'react';
import { HistoryItem as HistoryItemType } from '../../types/calculator';

interface HistoryItemProps {
  item: HistoryItemType;
  onClick: () => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item, onClick }) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="history-item" onClick={onClick}>
      <div className="history-item__expression">{item.expression}</div>
      <div className="history-item__result">= {item.result}</div>
      <div className="history-item__time">{formatTime(item.timestamp)}</div>
    </div>
  );
};
