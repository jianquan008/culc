import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { loadHistory as loadHistoryAction } from '../store/slices/historySlice';
import { saveHistory, loadHistory } from '../utils/historyStorage';

export const useHistoryPersistence = () => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.history.items);

  // 初始化时加载历史记录
  useEffect(() => {
    const storedHistory = loadHistory();
    if (storedHistory.length > 0) {
      dispatch(loadHistoryAction(storedHistory));
    }
  }, [dispatch]);

  // 历史记录变化时自动保存
  useEffect(() => {
    saveHistory(items);
  }, [items]);
};
