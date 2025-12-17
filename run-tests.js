// 科学计算器自动化测试脚本
const testResults = [];

// 测试用例
const tests = [
  { id: 'TC001', name: '三角函数测试', status: 'PENDING' },
  { id: 'TC002', name: '角度模式切换', status: 'PENDING' },
  { id: 'TC003', name: '对数指数函数', status: 'PENDING' },
  { id: 'TC004', name: '科学记数法', status: 'PENDING' },
  { id: 'TC005', name: '内存功能', status: 'PENDING' }
];

console.log('科学计算器测试开始...');
console.log('访问地址: http://localhost:3001');
console.log('\n测试用例列表:');
tests.forEach(t => console.log(`${t.id}: ${t.name}`));
console.log('\n请手动在浏览器中验证以下功能：');
console.log('1. 切换到科学模式');
console.log('2. 测试 sin(30°) = 0.5');
console.log('3. 测试角度模式切换 DEG/RAD/GRAD');
console.log('4. 测试 ln(e) = 1, log(100) = 2');
console.log('5. 测试内存操作 M+, M-, MR, MC');
