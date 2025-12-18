export type Theme = 'light' | 'dark';

export class ThemeManager {
  private static readonly THEME_KEY = 'calculator_theme';

  static applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  static saveTheme(theme: Theme | 'auto'): void {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  static loadTheme(): Theme | 'auto' {
    const saved = localStorage.getItem(this.THEME_KEY);
    return (saved as Theme | 'auto') || 'auto';
  }

  static getSystemTheme(): Theme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  static watchSystemTheme(callback: (theme: Theme) => void): () => void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      callback(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }
}
