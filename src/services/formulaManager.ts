import { v4 as uuidv4 } from 'uuid';
import Fuse from 'fuse.js';
import { Formula, Category } from '../types/formula';
import { FormulaStorage } from './formulaStorage';

export class FormulaManager {
  private storage: FormulaStorage;
  private fuse: Fuse<Formula> | null = null;

  constructor() {
    this.storage = new FormulaStorage();
  }

  async initialize(): Promise<void> {
    await this.storage.initialize();
    await this.updateSearchIndex();
  }

  async createFormula(data: Omit<Formula, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'lastUsedAt'>): Promise<Formula> {
    const formula: Formula = {
      ...data,
      id: uuidv4(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      usageCount: 0,
      lastUsedAt: 0
    };

    await this.storage.saveFormula(formula);
    await this.updateSearchIndex();
    return formula;
  }

  async updateFormula(id: string, updates: Partial<Formula>): Promise<void> {
    const formulas = await this.storage.getFormulas();
    const formula = formulas.find(f => f.id === id);
    
    if (!formula) throw new Error('Formula not found');
    
    const updatedFormula = {
      ...formula,
      ...updates,
      updatedAt: Date.now()
    };

    await this.storage.saveFormula(updatedFormula);
    await this.updateSearchIndex();
  }

  async deleteFormula(id: string): Promise<void> {
    await this.storage.deleteFormula(id);
    await this.updateSearchIndex();
  }

  async getFormulas(): Promise<Formula[]> {
    return this.storage.getFormulas();
  }

  async searchFormulas(query: string): Promise<Formula[]> {
    if (!query.trim()) {
      return this.getFormulas();
    }

    if (!this.fuse) {
      await this.updateSearchIndex();
    }

    const results = this.fuse!.search(query);
    return results.map(result => result.item);
  }

  async incrementUsage(id: string): Promise<void> {
    const formulas = await this.storage.getFormulas();
    const formula = formulas.find(f => f.id === id);
    
    if (formula) {
      formula.usageCount += 1;
      formula.lastUsedAt = Date.now();
      await this.storage.saveFormula(formula);
    }
  }

  async getCategories(): Promise<Category[]> {
    return this.storage.getCategories();
  }

  async saveCategory(category: Category): Promise<void> {
    await this.storage.saveCategory(category);
  }

  private async updateSearchIndex(): Promise<void> {
    const formulas = await this.storage.getFormulas();
    this.fuse = new Fuse(formulas, {
      keys: [
        { name: 'name', weight: 0.7 },
        { name: 'formula', weight: 0.5 },
        { name: 'tags', weight: 0.3 }
      ],
      threshold: 0.3,
      includeScore: true
    });
  }
}
