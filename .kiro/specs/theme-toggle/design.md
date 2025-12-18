# 主题切换功能设计文档

## 1. 系统架构

### 1.1 整体架构图
```
用户界面层
    ↓
ThemeToggle组件 → Redux Store (themeSlice)
    ↓                    ↓
ThemeManager ← SystemThemeDetector
    ↓
CSS Variables System → DOM更新
    ↓
localStorage持久化
```

### 1.2 核心组件关系
- **ThemeToggle**: UI交互组件，触发主题切换
- **themeSlice**: Redux状态管理，存储当前主题状态
- **ThemeManager**: 主题管理器，处理主题应用逻辑
- **SystemThemeDetector**: 系统主题检测器，监听系统变化

## 2. 数据模型设计

### 2.1 Redux State结构
```typescript
interface ThemeState {
  mode: 'light' | 'dark';           // 当前主题模式
  isAuto: boolean;                  // 是否跟随系统主题
  systemTheme: 'light' | 'dark';    // 系统主题
}
```

### 2.2 localStorage数据结构
```typescript
interface ThemeStorage {
  theme: 'light' | 'dark' | 'auto'; // 用户选择的主题
  timestamp: number;                // 保存时间戳
}
```

## 3. 组件设计

### 3.1 ThemeToggle组件
```typescript
interface ThemeToggleProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

// 组件状态
- 当前主题模式显示
- 点击切换功能
- 图标动画效果
- 键盘快捷键支持
```

### 3.2 组件层次结构
```
Calculator
├── Header
│   ├── ModeToggle (标准/科学)
│   └── ThemeToggle (新增)
├── Display
└── ButtonGrid
```

## 4. 界面设计

### 4.1 主题切换按钮设计
- **位置**: 计算器顶部右侧，与模式切换按钮并排
- **尺寸**: 32x32px (桌面端), 40x40px (移动端)
- **图标**: 太阳图标(浅色模式), 月亮图标(深色模式)
- **交互**: 点击切换，旋转180度动画

### 4.2 主题配色方案

#### 浅色主题 (Light Theme)
```css
:root[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --button-bg: #e0e0e0;
  --button-text: #333333;
  --button-hover: #d0d0d0;
  --operator-bg: #ff9500;
  --operator-text: #ffffff;
  --equals-bg: #4caf50;
  --equals-text: #ffffff;
  --border-color: #e0e0e0;
  --shadow: rgba(0, 0, 0, 0.1);
}
```

#### 深色主题 (Dark Theme)
```css
:root[data-theme="dark"] {
  --bg-primary: #1e1e1e;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --button-bg: #3a3a3a;
  --button-text: #ffffff;
  --button-hover: #4a4a4a;
  --operator-bg: #ff9f0a;
  --operator-text: #000000;
  --equals-bg: #30d158;
  --equals-text: #000000;
  --border-color: #3a3a3a;
  --shadow: rgba(0, 0, 0, 0.3);
}
```

## 5. API设计

### 5.1 Redux Actions
```typescript
// 主题切换动作
toggleTheme(): void
setTheme(theme: 'light' | 'dark'): void
setAutoTheme(enabled: boolean): void
updateSystemTheme(theme: 'light' | 'dark'): void
```

### 5.2 ThemeManager API
```typescript
class ThemeManager {
  // 主题操作
  static applyTheme(theme: 'light' | 'dark'): void
  static getSystemTheme(): 'light' | 'dark'
  static watchSystemTheme(callback: Function): () => void
  
  // 持久化
  static saveTheme(theme: 'light' | 'dark' | 'auto'): void
  static loadTheme(): 'light' | 'dark' | 'auto'
}
```

## 6. 数据流设计

### 6.1 主题切换流程
```
1. 用户点击ThemeToggle按钮
2. 触发toggleTheme() action
3. themeSlice更新state.mode
4. useEffect监听mode变化
5. 调用ThemeManager.applyTheme()
6. 设置CSS变量到DOM
7. 保存选择到localStorage
8. UI更新完成
```

### 6.2 系统主题跟随流程
```
1. 应用初始化
2. 从localStorage读取主题设置
3. 如果是'auto'，检测系统主题
4. 应用对应主题
5. 监听系统主题变化
6. 自动更新应用主题
```

## 7. 技术实现细节

### 7.1 CSS变量切换机制
```css
/* 基础组件样式 */
.calculator {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.button {
  background-color: var(--button-bg);
  color: var(--button-text);
  border: 1px solid var(--border-color);
}
```

### 7.2 系统主题检测
```typescript
// 检测系统主题
const getSystemTheme = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light';
};

// 监听系统主题变化
const watchSystemTheme = (callback: (theme: 'light' | 'dark') => void) => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };
  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
};
```

### 7.3 动画效果设计
```css
/* 主题切换过渡动画 */
* {
  transition: background-color 0.3s ease, 
              color 0.3s ease,
              border-color 0.3s ease;
}

/* 按钮旋转动画 */
.theme-toggle-icon {
  transition: transform 0.3s ease;
}

.theme-toggle-icon.switching {
  transform: rotate(180deg);
}
```

## 8. 错误处理

### 8.1 兼容性降级
- CSS变量不支持时使用类名切换
- localStorage不可用时使用内存存储
- matchMedia API不支持时禁用系统跟随

### 8.2 异常情况处理
- 主题文件加载失败的回退方案
- 无效主题值的默认处理
- 系统主题检测失败的处理

## 9. 性能优化

### 9.1 渲染优化
- 使用CSS变量避免重新渲染组件
- 防抖处理快速切换操作
- 延迟加载非关键主题资源

### 9.2 内存优化
- 及时清理事件监听器
- 避免不必要的状态更新
- 优化CSS选择器性能
