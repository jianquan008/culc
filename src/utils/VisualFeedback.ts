export class VisualFeedback {
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
