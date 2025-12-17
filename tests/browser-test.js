// 简单的浏览器功能测试脚本
// 这个脚本可以在浏览器控制台中运行来测试计算器功能

const BrowserTest = {
  // 等待元素出现
  waitForElement: (selector, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const checkElement = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        } else {
          setTimeout(checkElement, 100);
        }
      };
      checkElement();
    });
  },

  // 点击按钮
  clickButton: async (text) => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const button = buttons.find(btn => btn.textContent.trim() === text);
    if (!button) {
      throw new Error(`Button with text "${text}" not found`);
    }
    button.click();
    await new Promise(resolve => setTimeout(resolve, 100)); // 等待状态更新
  },

  // 获取显示内容
  getDisplay: () => {
    const display = document.querySelector('.display__main');
    return display ? display.textContent.trim() : null;
  },

  // 测试基本数字输入
  testNumberInput: async () => {
    console.log('Testing number input...');
    await BrowserTest.clickButton('5');
    const display = BrowserTest.getDisplay();
    if (display === '5') {
      console.log('✅ Number input test passed');
      return true;
    } else {
      console.log(`❌ Number input test failed. Expected: 5, Got: ${display}`);
      return false;
    }
  },

  // 测试基本运算
  testBasicCalculation: async () => {
    console.log('Testing basic calculation...');
    // 清除之前的输入
    await BrowserTest.clickButton('AC');
    
    // 执行 2 + 3 = 5
    await BrowserTest.clickButton('2');
    await BrowserTest.clickButton('+');
    await BrowserTest.clickButton('3');
    await BrowserTest.clickButton('=');
    
    const display = BrowserTest.getDisplay();
    if (display === '5') {
      console.log('✅ Basic calculation test passed');
      return true;
    } else {
      console.log(`❌ Basic calculation test failed. Expected: 5, Got: ${display}`);
      return false;
    }
  },

  // 测试清除功能
  testClearFunction: async () => {
    console.log('Testing clear function...');
    await BrowserTest.clickButton('7');
    await BrowserTest.clickButton('C');
    
    const display = BrowserTest.getDisplay();
    if (display === '0') {
      console.log('✅ Clear function test passed');
      return true;
    } else {
      console.log(`❌ Clear function test failed. Expected: 0, Got: ${display}`);
      return false;
    }
  },

  // 测试历史记录
  testHistoryFunction: async () => {
    console.log('Testing history function...');
    // 执行一个计算来生成历史记录
    await BrowserTest.clickButton('AC');
    await BrowserTest.clickButton('4');
    await BrowserTest.clickButton('×');
    await BrowserTest.clickButton('6');
    await BrowserTest.clickButton('=');
    
    // 检查历史记录是否更新
    const historyHeader = document.querySelector('.history__header');
    if (historyHeader && historyHeader.textContent.includes('History (1)')) {
      console.log('✅ History function test passed');
      return true;
    } else {
      console.log('❌ History function test failed');
      return false;
    }
  },

  // 运行所有测试
  runAllTests: async () => {
    console.log('🚀 Starting browser tests...');
    
    try {
      // 等待应用加载
      await BrowserTest.waitForElement('.calculator');
      console.log('✅ Calculator app loaded successfully');
      
      const results = [];
      results.push(await BrowserTest.testNumberInput());
      results.push(await BrowserTest.testBasicCalculation());
      results.push(await BrowserTest.testClearFunction());
      results.push(await BrowserTest.testHistoryFunction());
      
      const passed = results.filter(r => r).length;
      const total = results.length;
      
      console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);
      
      if (passed === total) {
        console.log('🎉 All browser tests passed!');
      } else {
        console.log('⚠️ Some tests failed. Please check the logs above.');
      }
      
      return passed === total;
    } catch (error) {
      console.error('❌ Test execution failed:', error);
      return false;
    }
  }
};

// 如果在浏览器环境中，自动运行测试
if (typeof window !== 'undefined') {
  // 等待页面加载完成后运行测试
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => BrowserTest.runAllTests(), 1000);
    });
  } else {
    setTimeout(() => BrowserTest.runAllTests(), 1000);
  }
}

// 导出供Node.js使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BrowserTest;
}
