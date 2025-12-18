export interface Formula {
  id: string;
  name: string;
  formula: string;
  expression: string;
  category: string;
  createdAt: number;
  updatedAt: number;
  usageCount: number;
  lastUsedAt: number;
  tags: string[];
  isFavorite: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  order: number;
  isDefault: boolean;
  formulaCount: number;
}

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'basic',
    name: '基础运算',
    color: '#1890ff',
    icon: 'calculator',
    order: 1,
    isDefault: true,
    formulaCount: 0
  },
  {
    id: 'scientific',
    name: '科学计算',
    color: '#52c41a',
    icon: 'experiment',
    order: 2,
    isDefault: true,
    formulaCount: 0
  },
  {
    id: 'unit-conversion',
    name: '单位换算',
    color: '#faad14',
    icon: 'swap',
    order: 3,
    isDefault: true,
    formulaCount: 0
  },
  {
    id: 'financial',
    name: '财务计算',
    color: '#f5222d',
    icon: 'dollar',
    order: 4,
    isDefault: true,
    formulaCount: 0
  },
  {
    id: 'custom',
    name: '自定义',
    color: '#722ed1',
    icon: 'star',
    order: 5,
    isDefault: true,
    formulaCount: 0
  }
];
