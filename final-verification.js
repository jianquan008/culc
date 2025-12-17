#!/usr/bin/env node

/**
 * 最终验证脚本 - 确保所有测试通过并生成最终报告
 */

import { execSync } from 'child_process';
import { performance } from 'perf_hooks';

console.log('🔍 计算器应用最终验证\n');

const tests = [
  {
    name: '单元测试',
    command: 'npm test -- --run',
    timeout: 30000
  },
  {
    name: '应用可访问性',
    command: 'curl -f -s http://localhost:3001/ > /dev/null',
    timeout: 5000
  },
  {
    name: '性能测试',
    command: 'node tests/performance-test.js',
    timeout: 15000
  }
];

let allPassed = true;
const results = [];

for (const test of tests) {
  console.log(`🧪 运行 ${test.name}...`);
  const startTime = performance.now();
  
  try {
    execSync(test.command, { 
      cwd: process.cwd(),
      timeout: test.timeout,
      stdio: 'pipe'
    });
    
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    
    console.log(`✅ ${test.name} 通过 (${duration}ms)`);
    results.push({ name: test.name, status: 'PASS', duration });
  } catch (error) {
    console.log(`❌ ${test.name} 失败`);
    console.log(`   错误: ${error.message}`);
    results.push({ name: test.name, status: 'FAIL', error: error.message });
    allPassed = false;
  }
}

console.log('\n📊 最终验证结果:');
console.log('='.repeat(50));

results.forEach(result => {
  const status = result.status === 'PASS' ? '✅' : '❌';
  const duration = result.duration ? ` (${result.duration}ms)` : '';
  console.log(`${status} ${result.name}${duration}`);
});

console.log('='.repeat(50));

if (allPassed) {
  console.log('🎉 所有验证通过！应用已准备好投入使用。');
  console.log('\n📋 快速访问:');
  console.log('   应用地址: http://localhost:3001/');
  console.log('   测试报告: ./test-report.md');
  console.log('   浏览器测试: ./test-runner.html');
  process.exit(0);
} else {
  console.log('⚠️ 部分验证失败，请检查上述错误。');
  process.exit(1);
}
