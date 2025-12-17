import { HistoryItem } from '../types/calculator';
import { MAX_HISTORY_COUNT } from '../constants/calculator';

export class StorageService {
  private readonly HISTORY_KEY = 'calculator_history';

  saveHistory(item: HistoryItem): void {
    const history = this.getHistory();
    history.unshift(item);
    
    if (history.length > MAX_HISTORY_COUNT) {
      history.splice(MAX_HISTORY_COUNT);
    }
    
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
  }

  getHistory(): HistoryItem[] {
    try {
      const stored = localStorage.getItem(this.HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  clearHistory(): void {
    localStorage.removeItem(this.HISTORY_KEY);
  }

  removeHistoryItem(id: string): void {
    const history = this.getHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(filtered));
  }
}
