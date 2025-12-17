# 计算器项目结构

## 目录结构

```
cu/
├── public/                 # 静态资源
│   ├── index.html         # HTML模板
│   └── favicon.ico        # 网站图标
├── src/                   # 源代码
│   ├── components/        # React组件
│   │   ├── Calculator/    # 计算器主组件
│   │   ├── Display/       # 显示屏组件
│   │   ├── ButtonPanel/   # 按钮面板
│   │   └── History/       # 历史记录组件
│   ├── store/            # Redux状态管理
│   │   ├── slices/       # Redux切片
│   │   └── index.ts      # Store配置
│   ├── services/         # 业务服务
│   │   ├── calculator-engine.ts  # 计算引擎
│   │   └── storage.ts    # 存储服务
│   ├── utils/            # 工具函数
│   │   ├── math.ts       # 数学工具
│   │   └── format.ts     # 格式化工具
│   ├── types/            # TypeScript类型
│   │   └── calculator.ts # 计算器类型定义
│   ├── constants/        # 常量定义
│   │   └── calculator.ts # 计算器常量
│   ├── styles/           # 全局样式
│   │   └── global.css    # 全局CSS
│   ├── App.tsx           # 应用根组件
│   └── main.tsx          # 应用入口
├── tests/                # 测试文件
│   ├── components/       # 组件测试
│   ├── services/         # 服务测试
│   └── utils/            # 工具测试
├── .kiro/                # Kiro配置
│   ├── steering/         # 项目规划文档
│   └── specs/            # 需求规格文档
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript配置
├── vite.config.ts        # Vite配置
├── eslint.config.js      # ESLint配置
└── README.md             # 项目说明
```

## 组件层次结构

```
App
└── Calculator
    ├── Display
    │   ├── MainDisplay      # 主显示区
    │   └── ExpressionDisplay # 表达式显示
    ├── ButtonPanel
    │   ├── NumberButton     # 数字按钮
    │   ├── OperatorButton   # 运算符按钮
    │   └── FunctionButton   # 功能按钮
    └── History
        ├── HistoryList      # 历史列表
        └── HistoryItem      # 历史项目
```

## 数据流架构

```
User Input → UI Components → Redux Actions → Reducers → State → UI Update
                ↓
            Calculator Engine → Local Storage
```

## 模块依赖关系

- **UI组件** 依赖 **Redux Store**
- **Redux Store** 依赖 **Calculator Engine**
- **Calculator Engine** 依赖 **Utils**
- **Storage Service** 独立模块，被 **Redux** 调用

## 配置文件说明

- `package.json`: 项目依赖和脚本配置
- `tsconfig.json`: TypeScript编译配置
- `vite.config.ts`: 构建工具配置
- `eslint.config.js`: 代码规范配置
