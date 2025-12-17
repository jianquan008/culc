import { describe, it, expect, beforeAll } from 'vitest';

describe('Calculator E2E Tests', () => {
  const baseUrl = 'http://localhost:3001';

  beforeAll(async () => {
    // 确保应用已启动
    const response = await fetch(baseUrl);
    expect(response.status).toBe(200);
  });

  describe('基本功能测试', () => {
    it('应用应该正常加载', async () => {
      const response = await fetch(baseUrl);
      const html = await response.text();
      
      expect(html).toContain('calculator-app');
      expect(response.status).toBe(200);
    });

    it('应该包含必要的计算器元素', async () => {
      const response = await fetch(baseUrl);
      const html = await response.text();
      
      // 检查是否包含React应用的根元素
      expect(html).toContain('id="root"');
      expect(html).toContain('calculator-app');
    });
  });

  describe('性能测试', () => {
    it('页面加载时间应该合理', async () => {
      const startTime = Date.now();
      const response = await fetch(baseUrl);
      const endTime = Date.now();
      
      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeLessThan(3000); // 3秒内加载
    });
  });
});
