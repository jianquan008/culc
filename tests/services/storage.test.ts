import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageService } from '../../src/services/storage';
import { HistoryItem } from '../../src/types/calculator';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('StorageService', () => {
  let service: StorageService;
  let mockHistoryItem: HistoryItem;

  beforeEach(() => {
    service = new StorageService();
    mockHistoryItem = {
      id: '1',
      expression: '2 + 3',
      result: '5',
      timestamp: Date.now(),
      isError: false
    };
    vi.clearAllMocks();
  });

  describe('保存历史记录', () => {
    it('应该保存历史项到localStorage', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      service.saveHistory(mockHistoryItem);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'calculator_history',
        JSON.stringify([mockHistoryItem])
      );
    });

    it('应该限制历史记录数量', () => {
      const existingHistory = Array.from({ length: 10 }, (_, i) => ({
        ...mockHistoryItem,
        id: i.toString()
      }));
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingHistory));
      
      service.saveHistory(mockHistoryItem);
      
      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData).toHaveLength(10);
      expect(savedData[0]).toEqual(mockHistoryItem);
    });
  });

  describe('获取历史记录', () => {
    it('应该返回存储的历史记录', () => {
      const history = [mockHistoryItem];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(history));
      
      const result = service.getHistory();
      
      expect(result).toEqual(history);
    });

    it('应该处理空存储', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = service.getHistory();
      
      expect(result).toEqual([]);
    });

    it('应该处理无效JSON', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      const result = service.getHistory();
      
      expect(result).toEqual([]);
    });
  });

  describe('清除历史记录', () => {
    it('应该清除localStorage中的历史记录', () => {
      service.clearHistory();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('calculator_history');
    });
  });
});
