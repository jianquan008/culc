import { performance } from 'perf_hooks';

class PerformanceTest {
  constructor(baseUrl = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  async testPageLoadTime() {
    console.log('🚀 Testing page load time...');
    
    const startTime = performance.now();
    
    try {
      const response = await fetch(this.baseUrl);
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      console.log(`📊 Page load time: ${loadTime.toFixed(2)}ms`);
      
      if (loadTime < 3000) {
        console.log('✅ Page load time test passed (< 3000ms)');
        return true;
      } else {
        console.log('❌ Page load time test failed (>= 3000ms)');
        return false;
      }
    } catch (error) {
      console.log('❌ Page load test failed:', error.message);
      return false;
    }
  }

  async testResponseTime() {
    console.log('🚀 Testing response time...');
    
    const times = [];
    const iterations = 5;
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      
      try {
        const response = await fetch(this.baseUrl);
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        times.push(responseTime);
        
        console.log(`  Request ${i + 1}: ${responseTime.toFixed(2)}ms`);
      } catch (error) {
        console.log(`❌ Request ${i + 1} failed:`, error.message);
        return false;
      }
    }
    
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const maxTime = Math.max(...times);
    const minTime = Math.min(...times);
    
    console.log(`📊 Average response time: ${avgTime.toFixed(2)}ms`);
    console.log(`📊 Max response time: ${maxTime.toFixed(2)}ms`);
    console.log(`📊 Min response time: ${minTime.toFixed(2)}ms`);
    
    if (avgTime < 1000) {
      console.log('✅ Response time test passed (< 1000ms average)');
      return true;
    } else {
      console.log('❌ Response time test failed (>= 1000ms average)');
      return false;
    }
  }

  async testResourceSize() {
    console.log('🚀 Testing resource size...');
    
    try {
      const response = await fetch(this.baseUrl);
      const html = await response.text();
      const htmlSize = new Blob([html]).size;
      
      console.log(`📊 HTML size: ${htmlSize} bytes (${(htmlSize / 1024).toFixed(2)} KB)`);
      
      if (htmlSize < 100 * 1024) { // 100KB
        console.log('✅ Resource size test passed (< 100KB)');
        return true;
      } else {
        console.log('❌ Resource size test failed (>= 100KB)');
        return false;
      }
    } catch (error) {
      console.log('❌ Resource size test failed:', error.message);
      return false;
    }
  }

  async testConcurrentRequests() {
    console.log('🚀 Testing concurrent requests...');
    
    const concurrentRequests = 10;
    const startTime = performance.now();
    
    try {
      const promises = Array(concurrentRequests).fill().map(() => fetch(this.baseUrl));
      const responses = await Promise.all(promises);
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      const successCount = responses.filter(r => r.ok).length;
      
      console.log(`📊 Concurrent requests: ${concurrentRequests}`);
      console.log(`📊 Successful responses: ${successCount}`);
      console.log(`📊 Total time: ${totalTime.toFixed(2)}ms`);
      console.log(`📊 Average time per request: ${(totalTime / concurrentRequests).toFixed(2)}ms`);
      
      if (successCount === concurrentRequests && totalTime < 5000) {
        console.log('✅ Concurrent requests test passed');
        return true;
      } else {
        console.log('❌ Concurrent requests test failed');
        return false;
      }
    } catch (error) {
      console.log('❌ Concurrent requests test failed:', error.message);
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting performance tests...\n');
    
    const results = [];
    results.push(await this.testPageLoadTime());
    console.log('');
    results.push(await this.testResponseTime());
    console.log('');
    results.push(await this.testResourceSize());
    console.log('');
    results.push(await this.testConcurrentRequests());
    
    const passed = results.filter(r => r).length;
    const total = results.length;
    
    console.log(`\n📊 Performance Test Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All performance tests passed!');
    } else {
      console.log('⚠️ Some performance tests failed.');
    }
    
    return passed === total;
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new PerformanceTest();
  tester.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export default PerformanceTest;
