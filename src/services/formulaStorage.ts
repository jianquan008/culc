import { Formula, Category, DEFAULT_CATEGORIES } from '../types/formula';

export class FormulaStorage {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'CalculatorFormulas';
  private readonly DB_VERSION = 1;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('formulas')) {
          const formulaStore = db.createObjectStore('formulas', { keyPath: 'id' });
          formulaStore.createIndex('category', 'category', { unique: false });
          formulaStore.createIndex('name', 'name', { unique: false });
          formulaStore.createIndex('usageCount', 'usageCount', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('categories')) {
          const categoryStore = db.createObjectStore('categories', { keyPath: 'id' });
          categoryStore.createIndex('order', 'order', { unique: false });
          
          // 初始化默认分类
          const transaction = (event.target as IDBOpenDBRequest).transaction!;
          const store = transaction.objectStore('categories');
          DEFAULT_CATEGORIES.forEach(category => {
            store.add(category);
          });
        }
      };
    });
  }

  async saveFormula(formula: Formula): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['formulas'], 'readwrite');
    const store = transaction.objectStore('formulas');
    
    return new Promise((resolve, reject) => {
      const request = store.put(formula);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getFormulas(): Promise<Formula[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['formulas'], 'readonly');
    const store = transaction.objectStore('formulas');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteFormula(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['formulas'], 'readwrite');
    const store = transaction.objectStore('formulas');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCategories(): Promise<Category[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['categories'], 'readonly');
    const store = transaction.objectStore('categories');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveCategory(category: Category): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['categories'], 'readwrite');
    const store = transaction.objectStore('categories');
    
    return new Promise((resolve, reject) => {
      const request = store.put(category);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
