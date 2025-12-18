import Fuse from 'fuse.js';
import { Formula } from '../types/formula';

export const searchConfig = {
  keys: [
    { name: 'name', weight: 0.7 },
    { name: 'formula', weight: 0.5 },
    { name: 'tags', weight: 0.3 }
  ],
  threshold: 0.3,
  distance: 100,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2
};

export class FormulaSearchEngine {
  private fuse: Fuse<Formula> | null = null;

  updateIndex(formulas: Formula[]): void {
    this.fuse = new Fuse(formulas, searchConfig);
  }

  search(query: string): Formula[] {
    if (!this.fuse || !query.trim()) {
      return [];
    }

    const results = this.fuse.search(query);
    return results.map(result => result.item);
  }

  highlightMatches(text: string, query: string): string {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}

export const formulaSearchEngine = new FormulaSearchEngine();
