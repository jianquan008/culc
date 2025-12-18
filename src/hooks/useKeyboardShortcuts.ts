import { useCallback, useEffect, useMemo, RefObject } from 'react';
import { useDispatch } from 'react-redux';
import { 
  inputNumber, 
  inputDecimal, 
  inputOperator, 
  calculate, 
  clear, 
  deleteLast,
  copyResult,
  pasteValue
} from '../store/slices/calculatorSlice';
import { toggleHistoryPanel } from '../store/slices/historySlice';
import { toggleTheme } from '../store/slices/themeSlice';
import { KeyboardManager } from '../utils/KeyboardManager';
import { VisualFeedback } from '../utils/VisualFeedback';
import { OPERATORS } from '../constants/calculator';

interface KeyboardShortcutsConfig {
  calculatorRef: RefObject<HTMLDivElement>;
  isScientificMode?: boolean;
}

export const useKeyboardShortcuts = ({ 
  calculatorRef, 
  isScientificMode = false 
}: KeyboardShortcutsConfig) => {
  const dispatch = useDispatch();
  
  // 快捷键映射配置
  const keyMap = useMemo(() => ({
    // 数字键
    '0': () => dispatch(inputNumber('0')),
    '1': () => dispatch(inputNumber('1')),
    '2': () => dispatch(inputNumber('2')),
    '3': () => dispatch(inputNumber('3')),
    '4': () => dispatch(inputNumber('4')),
    '5': () => dispatch(inputNumber('5')),
    '6': () => dispatch(inputNumber('6')),
    '7': () => dispatch(inputNumber('7')),
    '8': () => dispatch(inputNumber('8')),
    '9': () => dispatch(inputNumber('9')),
    '.': () => dispatch(inputDecimal()),
    
    // 运算符
    '+': () => dispatch(inputOperator(OPERATORS.ADD)),
    '-': () => dispatch(inputOperator(OPERATORS.SUBTRACT)),
    '*': () => dispatch(inputOperator(OPERATORS.MULTIPLY)),
    '/': () => dispatch(inputOperator(OPERATORS.DIVIDE)),
    
    // 功能键
    'Enter': () => dispatch(calculate()),
    '=': () => dispatch(calculate()),
    'Escape': () => dispatch(clear('AC')),
    'Backspace': () => dispatch(deleteLast()),
  }), [dispatch]);

  // 处理粘贴
  const handlePaste = useCallback(async () => {
    const pastedValue = await KeyboardManager.handlePaste();
    if (pastedValue) {
      dispatch(pasteValue(pastedValue));
    }
  }, [dispatch]);

  // 组合键处理
  const handleCombinationKey = useCallback((event: KeyboardEvent) => {
    const { ctrlKey, metaKey, key } = event;
    const isModifierPressed = ctrlKey || metaKey;
    
    if (!isModifierPressed) return false;
    
    switch (key.toLowerCase()) {
      case 'c':
        event.preventDefault();
        dispatch(copyResult());
        return true;
      case 'v':
        event.preventDefault();
        handlePaste();
        return true;
      case 'h':
        event.preventDefault();
        dispatch(toggleHistoryPanel());
        return true;
      case 't':
        event.preventDefault();
        dispatch(toggleTheme());
        return true;
      default:
        return false;
    }
  }, [dispatch, handlePaste]);

  // 键盘事件处理
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // 处理组合键
    if (handleCombinationKey(event)) {
      return;
    }
    
    // 处理单键
    const normalizedKey = KeyboardManager.normalizeKey(event);
    const handler = keyMap[normalizedKey];
    
    if (handler) {
      event.preventDefault();
      handler();
      VisualFeedback.highlightButton(normalizedKey);
    }
  }, [keyMap, handleCombinationKey]);

  // 事件监听器管理
  useEffect(() => {
    const element = calculatorRef.current;
    if (!element) return;
    
    element.addEventListener('keydown', handleKeyDown);
    element.setAttribute('tabindex', '0'); // 确保可获得焦点
    element.focus();
    
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};
