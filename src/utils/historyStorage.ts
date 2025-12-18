import { HistoryItem } from '../types/calculator';

const STORAGE_KEY = 'calculator-history';
const MAX_HISTORY_COUNT = 50;

export const saveHistory = (items: HistoryItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
};

export const loadHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const items = JSON.parse(stored);
    return Array.isArray(items) ? items.filter(validateHistoryItem) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
};

export const clearStoredHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};

const validateHistoryItem = (item: any): item is HistoryItem => {
  return (
    typeof item.id === 'string' &&
    typeof item.expression === 'string' &&
    typeof item.result === 'string' &&
    typeof item.timestamp === 'number'
  );
};

export const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};
