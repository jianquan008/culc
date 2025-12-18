# 键盘快捷键功能设计文档

## 1. 系统架构

### 1.1 整体架构

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   键盘事件      │───▶│  快捷键管理Hook   │───▶│   Redux Actions │
│ (KeyboardEvent) │    │ (useKeyboardShortcuts)│    │  (Calculator)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   事件监听器     │    │   视觉反馈管理    │    │   状态更新      │
│ (addEventListener)│    │ (Button Highlight)│    │ (State Update)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 1.2 核心组件

- **useKeyboardShortcuts Hook**: 键盘事件管理和快捷键映射
- **KeyboardManager**: 键盘事件处理和验证
- **VisualFeedback**: 按钮高亮和视觉反馈管理
- **ShortcutTooltip**: 快捷键提示组件

## 2. 技术设计

### 2.1 键盘事件管理Hook

```typescript
interface KeyboardShortcutsConfig {
  calculatorRef: RefObject<HTMLDivElement>;
  isScientificMode?: boolean;
}

export const useKeyboardShortcuts = ({ 
  calculatorRef, 
  isScientificMode = false 
}: KeyboardShortcutsConfig) => {
  const dispatch = useDispatch();
  
  // 快捷键映射配置
  const keyMap = useMemo(() => ({
    // 数字键
    '0': () => dispatch(inputDigit('0')),
    '1': () => dispatch(inputDigit('1')),
    '2': () => dispatch(inputDigit('2')),
    '3': () => dispatch(inputDigit('3')),
    '4': () => dispatch(inputDigit('4')),
    '5': () => dispatch(inputDigit('5')),
    '6': () => dispatch(inputDigit('6')),
    '7': () => dispatch(inputDigit('7')),
    '8': () => dispatch(inputDigit('8')),
    '9': () => dispatch(inputDigit('9')),
    '.': () => dispatch(inputDecimal()),
    
    // 运算符
    '+': () => dispatch(inputOperator('+')),
    '-': () => dispatch(inputOperator('-')),
    '*': () => dispatch(inputOperator('×')),
    '/': () => dispatch(inputOperator('÷')),
    
    // 功能键
    'Enter': () => dispatch(calculate()),
    'Escape': () => dispatch(clear()),
    'Backspace': () => dispatch(deleteLast()),
  }), [dispatch]);

  // 组合键处理
  const handleCombinationKey = useCallback((event: KeyboardEvent) => {
    const { ctrlKey, metaKey, key } = event;
    const isModifierPressed = ctrlKey || metaKey;
    
    if (!isModifierPressed) return false;
    
    switch (key.toLowerCase()) {
      case 'c':
        event.preventDefault();
        dispatch(copyResult());
        return true;
      case 'v':
        event.preventDefault();
        handlePaste();
        return true;
      case 'h':
        event.preventDefault();
        dispatch(toggleHistory());
        return true;
      case 't':
        event.preventDefault();
        dispatch(toggleTheme());
        return true;
      default:
        return false;
    }
  }, [dispatch]);

  // 键盘事件处理
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // 处理组合键
    if (handleCombinationKey(event)) {
      return;
    }
    
    // 处理单键
    const normalizedKey = KeyboardManager.normalizeKey(event);
    const handler = keyMap[normalizedKey];
    
    if (handler) {
      event.preventDefault();
      handler();
      VisualFeedback.highlightButton(normalizedKey);
    }
  }, [keyMap, handleCombinationKey]);

  // 事件监听器管理
  useEffect(() => {
    const element = calculatorRef.current;
    if (!element) return;
    
    element.addEventListener('keydown', handleKeyDown);
    element.setAttribute('tabindex', '0'); // 确保可获得焦点
    element.focus();
    
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};
```

### 2.2 键盘管理器

```typescript
class KeyboardManager {
  // 按键别名映射
  private static readonly KEY_ALIASES: Record<string, string> = {
    'NumpadEnter': 'Enter',
    'Numpad0': '0',
    'Numpad1': '1',
    'Numpad2': '2',
    'Numpad3': '3',
    'Numpad4': '4',
    'Numpad5': '5',
    'Numpad6': '6',
    'Numpad7': '7',
    'Numpad8': '8',
    'Numpad9': '9',
    'NumpadDecimal': '.',
    'NumpadAdd': '+',
    'NumpadSubtract': '-',
    'NumpadMultiply': '*',
    'NumpadDivide': '/',
  };
  
  // 标准化按键
  static normalizeKey(event: KeyboardEvent): string {
    const key = event.key;
    return this.KEY_ALIASES[key] || key;
  }
  
  // 验证输入
  static isValidInput(key: string): boolean {
    return /^[0-9+\-*/.=]$/.test(key) || 
           ['Enter', 'Escape', 'Backspace'].includes(key);
  }
  
  // 处理粘贴内容
  static async handlePaste(): Promise<string | null> {
    try {
      const text = await navigator.clipboard.readText();
      const cleaned = text.replace(/[^0-9.]/g, '');
      
      if (/^\d*\.?\d*$/.test(cleaned) && cleaned !== '') {
        return cleaned;
      }
      return null;
    } catch (error) {
      console.warn('无法访问剪贴板:', error);
      return null;
    }
  }
}
```

### 2.3 视觉反馈管理

```typescript
class VisualFeedback {
  private static activeButtons = new Set<string>();
  private static readonly HIGHLIGHT_DURATION = 150;
  
  // 高亮按钮
  static highlightButton(key: string): void {
    const button = document.querySelector(`[data-key="${key}"]`);
    if (button && !this.activeButtons.has(key)) {
      button.classList.add('keyboard-active');
      this.activeButtons.add(key);
      
      setTimeout(() => {
        this.removeHighlight(key);
      }, this.HIGHLIGHT_DURATION);
    }
  }
  
  // 移除高亮
  static removeHighlight(key: string): void {
    const button = document.querySelector(`[data-key="${key}"]`);
    if (button) {
      button.classList.remove('keyboard-active');
      this.activeButtons.delete(key);
    }
  }
  
  // 清除所有高亮
  static clearAllHighlights(): void {
    this.activeButtons.forEach(key => {
      this.removeHighlight(key);
    });
  }
}
```

### 2.4 快捷键提示组件

```typescript
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
```

## 3. 样式设计

### 3.1 按钮高亮效果

```css
.calculator-button {
  position: relative;
  transition: all 0.1s ease;
}

.calculator-button.keyboard-active {
  background-color: var(--button-active-bg);
  transform: scale(0.95);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.calculator-button .shortcut-hint {
  position: absolute;
  bottom: 2px;
  right: 4px;
  font-size: 10px;
  color: var(--text-secondary);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.calculator-button:hover .shortcut-hint {
  opacity: 0.7;
}

.shortcut-tooltip-container {
  position: relative;
  display: inline-block;
}
```

### 3.2 主题适配

```css
/* 浅色主题 */
[data-theme="light"] {
  --button-active-bg: #e6f3ff;
  --text-secondary: #666;
}

/* 深色主题 */
[data-theme="dark"] {
  --button-active-bg: #2a4a6b;
  --text-secondary: #aaa;
}
```

## 4. 数据流设计

### 4.1 键盘事件处理流程

```
用户按键
    ↓
事件监听器捕获
    ↓
判断是否为组合键
    ↓
标准化按键值
    ↓
查找快捷键映射
    ↓
执行对应Redux Action
    ↓
触发视觉反馈
    ↓
更新计算器状态
```

### 4.2 状态管理集成

```typescript
// 扩展现有calculatorSlice
export const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    // 现有reducers...
    
    // 新增快捷键相关actions
    copyResult: (state) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(state.display);
      }
    },
    
    pasteValue: (state, action: PayloadAction<string>) => {
      const value = action.payload;
      if (value && /^\d*\.?\d*$/.test(value)) {
        state.display = value;
        state.previousValue = null;
        state.operation = null;
        state.waitingForOperand = false;
      }
    }
  }
});
```

## 5. 集成方案

### 5.1 Calculator组件集成

```typescript
export const Calculator: React.FC = () => {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const { mode } = useSelector((state: RootState) => state.calculator);
  
  // 启用键盘快捷键
  useKeyboardShortcuts({
    calculatorRef,
    isScientificMode: mode === 'scientific'
  });
  
  return (
    <div 
      ref={calculatorRef}
      className="calculator"
      tabIndex={0}
    >
      {/* 现有计算器组件 */}
    </div>
  );
};
```

### 5.2 Button组件扩展

```typescript
interface ButtonProps {
  value: string;
  onClick: () => void;
  className?: string;
  shortcut?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  value, 
  onClick, 
  className, 
  shortcut 
}) => {
  return (
    <ShortcutTooltip shortcut={shortcut}>
      <button
        className={`calculator-button ${className || ''}`}
        onClick={onClick}
        data-key={shortcut}
      >
        {value}
      </button>
    </ShortcutTooltip>
  );
};
```

## 6. 性能优化

### 6.1 事件处理优化
- 使用useCallback缓存事件处理函数
- 防抖处理连续按键事件
- 及时清理事件监听器

### 6.2 内存管理
- 使用WeakMap存储按钮引用
- 定时清理过期的高亮状态
- 避免内存泄漏

## 7. 测试策略

### 7.1 单元测试
- 快捷键映射函数测试
- 输入验证算法测试
- 视觉反馈管理测试

### 7.2 集成测试
- 键盘输入端到端测试
- Redux状态更新测试
- 浏览器兼容性测试

### 7.3 用户体验测试
- 快捷键响应速度测试
- 连续按键处理测试
- 视觉反馈效果测试
