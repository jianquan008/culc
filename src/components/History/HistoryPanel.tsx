import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { 
  clearHistory, 
  setSearchQuery, 
  deleteHistoryItem 
} from '../../store/slices/historySlice';
import { HistoryItem } from './HistoryItem';
import { HistoryItem as HistoryItemType } from '../../types/calculator';
import './HistoryPanel.css';

interface HistoryPanelProps {
  isVisible: boolean;
  onItemClick: (item: HistoryItemType) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isVisible,
  onItemClick
}) => {
  const dispatch = useDispatch();
  const { items, searchQuery } = useSelector((state: RootState) => state.history);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    return items.filter(item =>
      item.expression.includes(searchQuery) ||
      item.result.includes(searchQuery)
    );
  }, [items, searchQuery]);

  const handleClear = () => {
    if (window.confirm('确定要清空所有历史记录吗？')) {
      dispatch(clearHistory());
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleDeleteItem = (id: string) => {
    dispatch(deleteHistoryItem(id));
  };

  return (
    <div className={`history-panel ${isVisible ? 'visible' : ''}`}>
      <div className="history-header">
        <h3>历史记录 ({items.length})</h3>
        <button className="clear-button" onClick={handleClear}>
          清空
        </button>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="搜索历史..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="history-list">
        {filteredItems.length === 0 ? (
          <div className="empty-state">
            {searchQuery ? '未找到匹配记录' : '暂无历史记录'}
          </div>
        ) : (
          filteredItems.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              onClick={() => onItemClick(item)}
              onDelete={() => handleDeleteItem(item.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
