export class KeyboardManager {
  // 按键别名映射
  private static readonly KEY_ALIASES: Record<string, string> = {
    'NumpadEnter': 'Enter',
    'Numpad0': '0',
    'Numpad1': '1',
    'Numpad2': '2',
    'Numpad3': '3',
    'Numpad4': '4',
    'Numpad5': '5',
    'Numpad6': '6',
    'Numpad7': '7',
    'Numpad8': '8',
    'Numpad9': '9',
    'NumpadDecimal': '.',
    'NumpadAdd': '+',
    'NumpadSubtract': '-',
    'NumpadMultiply': '*',
    'NumpadDivide': '/',
  };
  
  // 标准化按键
  static normalizeKey(event: KeyboardEvent): string {
    const key = event.key;
    return this.KEY_ALIASES[key] || key;
  }
  
  // 验证输入
  static isValidInput(key: string): boolean {
    return /^[0-9+\-*/.=]$/.test(key) || 
           ['Enter', 'Escape', 'Backspace'].includes(key);
  }
  
  // 处理粘贴内容
  static async handlePaste(): Promise<string | null> {
    try {
      const text = await navigator.clipboard.readText();
      const cleaned = text.replace(/[^0-9.]/g, '');
      
      if (/^\d*\.?\d*$/.test(cleaned) && cleaned !== '') {
        return cleaned;
      }
      return null;
    } catch (error) {
      console.warn('无法访问剪贴板:', error);
      return null;
    }
  }
}
