import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { loadHistoryItem, clearHistory } from '../../store/slices/calculatorSlice';
import { HistoryItem } from './HistoryItem';
import './History.css';

export const History: React.FC = () => {
  const dispatch = useDispatch();
  const { history } = useSelector((state: RootState) => state.calculator);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleItemClick = (id: string) => {
    dispatch(loadHistoryItem(id));
    setIsExpanded(false);
  };

  const handleClear = () => {
    dispatch(clearHistory());
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`history ${isExpanded ? 'history--expanded' : ''}`}>
      <div className="history__header" onClick={toggleExpanded}>
        <span>History ({history.length})</span>
        <span className={`history__arrow ${isExpanded ? 'history__arrow--up' : ''}`}>▼</span>
      </div>
      
      {isExpanded && (
        <div className="history__panel">
          {history.length === 0 ? (
            <div className="history__empty">No calculations yet</div>
          ) : (
            <>
              <div className="history__actions">
                <button className="history__clear" onClick={handleClear}>
                  Clear All
                </button>
              </div>
              <div className="history__list">
                {history.map((item) => (
                  <HistoryItem
                    key={item.id}
                    item={item}
                    onClick={() => handleItemClick(item.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
