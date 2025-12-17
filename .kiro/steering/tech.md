# 计算器技术规划

## 技术栈选择

### 前端框架
- **React 18+**: 现代化组件开发，支持并发特性
- **TypeScript**: 类型安全，提升代码质量
- **Vite**: 快速构建和热更新

### 状态管理
- **Redux Toolkit**: 简化状态管理，处理复杂计算逻辑

### UI组件
- **Ant Design**: PC端UI组件库
- **Ant Design Mobile**: 移动端适配
- **CSS Modules + Styled Components**: 样式解决方案

### 工具链
- **Jest + React Testing Library**: 测试框架
- **ESLint + Prettier**: 代码规范
- **Husky**: Git hooks

## 架构设计

### 分层架构
```
展示层 (UI Components)
    ↓
业务逻辑层 (Redux Store + Business Logic)
    ↓
数据层 (Local Storage + State Management)
    ↓
工具层 (Utils + Constants)
```

### 核心模块
1. **计算引擎**: 表达式解析和运算求值
2. **状态管理**: 应用状态和历史记录
3. **UI组件**: 显示屏、按钮面板、历史面板
4. **存储服务**: 本地数据持久化

## 技术决策

### 计算精度
- 使用 `decimal.js` 处理浮点数精度问题
- 支持15位有效数字

### 跨平台适配
- 响应式设计，CSS媒体查询
- 触摸事件和键盘事件统一处理

### 性能优化
- React.memo 和 useMemo 减少重渲染
- 虚拟化长列表（历史记录）
- 代码分割和懒加载

## 开发规范

### 代码组织
```
src/
├── components/     # UI组件
├── store/         # Redux状态管理
├── services/      # 业务服务
├── utils/         # 工具函数
├── types/         # TypeScript类型定义
└── constants/     # 常量定义
```

### 命名规范
- 组件：PascalCase (Calculator, ButtonPanel)
- 文件：kebab-case (calculator-engine.ts)
- 变量/函数：camelCase (calculateResult)
- 常量：UPPER_SNAKE_CASE (MAX_HISTORY_COUNT)
