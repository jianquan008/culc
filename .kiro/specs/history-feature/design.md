# 计算器历史记录功能设计文档

## 1. 系统架构

### 1.1 整体架构图

```
┌─────────────────────────────────────────────────────┐
│                   Calculator App                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐         ┌──────────────────┐    │
│  │  Calculator  │────────▶│  History Panel   │    │
│  │  Component   │         │   Component      │    │
│  └──────┬───────┘         └────────┬─────────┘    │
│         │                          │               │
│         │                          │               │
│         ▼                          ▼               │
│  ┌─────────────────────────────────────────┐      │
│  │         Redux Store                     │      │
│  │  ┌──────────────┐  ┌─────────────────┐ │      │
│  │  │ Calculator   │  │  History Slice  │ │      │
│  │  │   Slice      │  │                 │ │      │
│  │  └──────────────┘  └────────┬────────┘ │      │
│  └────────────────────────────┬────────────┘      │
│                               │                    │
│                               ▼                    │
│                    ┌──────────────────┐           │
│                    │  localStorage    │           │
│                    └──────────────────┘           │
└─────────────────────────────────────────────────────┘
```

### 1.2 数据流图

```
用户计算 → dispatch(addHistory) → Redux Store → useEffect监听 → localStorage持久化
                                        ↓
                                  History Panel
                                        ↓
                                  用户点击历史
                                        ↓
                                  填入Calculator
```

## 2. 数据模型设计

### 2.1 HistoryItem 接口

```typescript
interface HistoryItem {
  id: string;              // 唯一标识符
  expression: string;      // 计算表达式
  result: string;          // 计算结果
  timestamp: number;       // 时间戳
}
```

### 2.2 HistoryState 接口

```typescript
interface HistoryState {
  items: HistoryItem[];    // 历史记录列表
  searchQuery: string;     // 搜索关键词
  isVisible: boolean;      // 面板显示状态
}
```

## 3. Redux Slice 设计

### 3.1 historySlice 结构

```typescript
const historySlice = createSlice({
  name: 'history',
  initialState: {
    items: [],
    searchQuery: '',
    isVisible: false
  },
  reducers: {
    addHistoryItem,      // 添加历史记录
    deleteHistoryItem,   // 删除单条记录
    clearHistory,        // 清空所有记录
    setSearchQuery,      // 设置搜索关键词
    toggleHistoryPanel,  // 切换面板显示
    loadHistory         // 从localStorage加载
  }
});
```

### 3.2 Actions 定义

```typescript
// 添加历史记录
addHistoryItem: (state, action: PayloadAction<Omit<HistoryItem, 'id'>>) => {
  const newItem = {
    ...action.payload,
    id: Date.now().toString()
  };
  state.items.unshift(newItem);
  if (state.items.length > 50) {
    state.items = state.items.slice(0, 50);
  }
}

// 删除历史记录
deleteHistoryItem: (state, action: PayloadAction<string>) => {
  state.items = state.items.filter(item => item.id !== action.payload);
}

// 清空历史
clearHistory: (state) => {
  state.items = [];
}
```

## 4. 组件设计

### 4.1 HistoryPanel 组件

```typescript
interface HistoryPanelProps {
  isVisible: boolean;
  onItemClick: (item: HistoryItem) => void;
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

  return (
    <div className={`history-panel ${isVisible ? 'visible' : ''}`}>
      {/* 面板内容 */}
    </div>
  );
};
```

### 4.2 HistoryItem 组件

```typescript
interface HistoryItemProps {
  item: HistoryItem;
  onClick: () => void;
  onDelete: () => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({
  item,
  onClick,
  onDelete
}) => {
  return (
    <div className="history-item" onClick={onClick}>
      <div className="history-expression">{item.expression}</div>
      <div className="history-result">= {item.result}</div>
      <div className="history-footer">
        <span className="history-time">{formatTime(item.timestamp)}</span>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }}>×</button>
      </div>
    </div>
  );
};
```

## 5. 持久化设计

### 5.1 localStorage 管理

```typescript
const STORAGE_KEY = 'calculator-history';

// 保存到localStorage
export const saveHistory = (items: HistoryItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
};

// 从localStorage加载
export const loadHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
};
```

### 5.2 自动持久化 Hook

```typescript
export const useHistoryPersistence = () => {
  const items = useSelector((state: RootState) => state.history.items);
  
  useEffect(() => {
    saveHistory(items);
  }, [items]);
};
```

## 6. UI/UX 设计

### 6.1 布局设计

```
┌─────────────────────────────────────┐
│ 历史记录 (15)              [清空]    │
├─────────────────────────────────────┤
│ [🔍] 搜索历史...                     │
├─────────────────────────────────────┤
│ 2 + 3 × 4                      [×]  │
│ = 14                                │
│ 2分钟前                              │
├─────────────────────────────────────┤
│ √(16) + 5²                     [×]  │
│ = 29                                │
│ 5分钟前                              │
└─────────────────────────────────────┘
```

### 6.2 样式规范

```css
.history-panel {
  width: 320px;
  height: 100%;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.history-panel.visible {
  transform: translateX(0);
}

.history-item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s;
}

.history-item:hover {
  background: var(--hover-bg);
}
```

## 7. 交互流程

### 7.1 添加历史记录流程

```
用户点击 = 按钮
    ↓
Calculator 执行计算
    ↓
dispatch(addHistoryItem({
  expression: currentExpression,
  result: calculationResult,
  timestamp: Date.now()
}))
    ↓
Redux Store 更新
    ↓
useEffect 触发持久化
    ↓
localStorage 保存
```

### 7.2 重用历史记录流程

```
用户点击历史项
    ↓
onItemClick(item) 回调
    ↓
Calculator 接收 item.expression
    ↓
更新输入框显示
    ↓
用户可继续编辑或计算
```

## 8. 性能优化

### 8.1 搜索优化
- 使用 useMemo 缓存过滤结果
- 防抖处理搜索输入

### 8.2 渲染优化
- 虚拟滚动（如果历史记录很多）
- React.memo 优化 HistoryItem 组件

### 8.3 存储优化
- 限制最大50条记录
- 压缩存储格式

## 9. 错误处理

### 9.1 localStorage 不可用
```typescript
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};
```

### 9.2 数据格式错误
```typescript
const validateHistoryItem = (item: any): item is HistoryItem => {
  return (
    typeof item.id === 'string' &&
    typeof item.expression === 'string' &&
    typeof item.result === 'string' &&
    typeof item.timestamp === 'number'
  );
};
```

## 10. 主题集成

### 10.1 主题变量使用
```css
.history-panel {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.history-item:hover {
  background: var(--hover-bg);
}
```

### 10.2 暗色模式适配
- 自动跟随现有主题系统
- 使用 CSS 变量确保一致性
