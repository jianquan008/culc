# 项目结构文档 - 主题切换功能

## 当前项目结构
```
cu/
├── src/
│   ├── components/          # React组件
│   ├── store/              # Redux状态管理
│   ├── styles/             # 样式文件
│   └── utils/              # 工具函数
├── package.json
└── vite.config.ts
```

## 新增文件结构
```
src/
├── components/
│   └── ThemeToggle/        # 主题切换组件
│       ├── index.tsx
│       └── ThemeToggle.module.css
├── store/
│   └── slices/
│       └── themeSlice.ts   # 主题状态管理
├── utils/
│   ├── themeManager.ts     # 主题管理器
│   └── systemTheme.ts      # 系统主题检测
└── styles/
    └── themes.css          # 主题CSS变量
```

## 集成点
- **Calculator组件**：添加ThemeToggle组件
- **store/index.ts**：注册themeSlice
- **App.tsx**：初始化主题系统
- **index.css**：引入主题变量

## 依赖关系
- ThemeToggle → themeSlice
- themeManager → systemTheme
- 所有组件 → themes.css变量
