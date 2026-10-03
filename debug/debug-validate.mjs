import { validateBasicConfig, validateAdvancedConfig } from '../src/core/validate.js';

const POOL = 10;

const cases = [
  { name: '合法：长度3 回合5', config: { sequenceLength: 3, maxRounds: 5 }, poolSize: POOL },
  { name: '合法：长度2 不限回合', config: { sequenceLength: 2, maxRounds: null }, poolSize: POOL },
  { name: '合法：长度=池大小 回合1', config: { sequenceLength: POOL, maxRounds: 1 }, poolSize: POOL },
  { name: '非法：长度1（过小）', config: { sequenceLength: 1, maxRounds: 5 }, poolSize: POOL },
  { name: '非法：长度2.5（小数）', config: { sequenceLength: 2.5, maxRounds: 5 }, poolSize: POOL },
  { name: "非法：长度'3'（字符串）", config: { sequenceLength: '3', maxRounds: 5 }, poolSize: POOL },
  { name: '非法：长度0', config: { sequenceLength: 0, maxRounds: 5 }, poolSize: POOL },
  { name: '非法：长度-2', config: { sequenceLength: -2, maxRounds: 5 }, poolSize: POOL },
  { name: '非法：长度11（超池）', config: { sequenceLength: 11, maxRounds: 5 }, poolSize: POOL },
  { name: '非法：回合0', config: { sequenceLength: 3, maxRounds: 0 }, poolSize: POOL },
  { name: '非法：回合1.5', config: { sequenceLength: 3, maxRounds: 1.5 }, poolSize: POOL },
  { name: "非法：回合'5'（字符串）", config: { sequenceLength: 3, maxRounds: '5' }, poolSize: POOL },
  { name: '非法：回合-3', config: { sequenceLength: 3, maxRounds: -3 }, poolSize: POOL },
  { name: '非法：config=null', config: null, poolSize: POOL },
  { name: '非法：config=undefined', config: undefined, poolSize: POOL },
  { name: '非法：poolSize=0（开发侧）', config: { sequenceLength: 3, maxRounds: 5 }, poolSize: 0 },
];

console.log('=== debug-validate ===');
for (const c of cases) {
  const result = validateBasicConfig(c.config, c.poolSize);
  const len = c.config?.sequenceLength;
  const rounds = c.config?.maxRounds;
  console.log(`用例: ${c.name}`);
  console.log(`  输入 sequenceLength=${JSON.stringify(len)} (${typeof len}) maxRounds=${JSON.stringify(rounds)} (${typeof rounds}) poolSize=${c.poolSize}`);
  console.log(`  valid=${result.valid} errors=${JSON.stringify(result.errors)}`);
}
console.log('本模块 debug 模式支持参数：无（用例内置）');

console.log('');
console.log('=== 进阶模式 validateAdvancedConfig（期望值内置断言）===');

const advCases = [
  { name: '合法：有效4 总数6 不限回合', config: { validLength: 4, totalItems: 6, maxRounds: null }, poolSize: 12,
    expValid: true, expErrors: [] },
  { name: '合法边界：有效6 总数6（无干扰项）回合3', config: { validLength: 6, totalItems: 6, maxRounds: 3 }, poolSize: 12,
    expValid: true, expErrors: [] },
  { name: '非法：总数3 < 有效4', config: { validLength: 4, totalItems: 3, maxRounds: 5 }, poolSize: 12,
    expValid: false, expErrors: ['总物品数不能少于有效物品数'] },
  { name: '非法：总数13 超池12', config: { validLength: 4, totalItems: 13, maxRounds: null }, poolSize: 12,
    expValid: false, expErrors: ['总物品数不能超过物品池大小 12'] },
  { name: '守卫：config=null', config: null, poolSize: 12,
    expValid: false, expErrors: ['配置对象无效'] },
  { name: '守卫：poolSize=0（开发侧）', config: { validLength: 4, totalItems: 6, maxRounds: null }, poolSize: 0,
    expValid: false, expErrors: ['物品池大小无效（开发侧错误）'] },
];

let allPassed = true;
for (const c of advCases) {
  const result = validateAdvancedConfig(c.config, c.poolSize);
  const vl = c.config?.validLength;
  const ti = c.config?.totalItems;
  const mr = c.config?.maxRounds;
  const validOk = result.valid === c.expValid;
  const errorsOk = JSON.stringify(result.errors) === JSON.stringify(c.expErrors);
  const ok = validOk && errorsOk;
  if (!ok) allPassed = false;
  console.log(`用例: ${c.name}`);
  console.log(`  输入 validLength=${JSON.stringify(vl)} (${typeof vl}) totalItems=${JSON.stringify(ti)} (${typeof ti}) maxRounds=${JSON.stringify(mr)} poolSize=${c.poolSize}`);
  console.log(`  实际 valid=${result.valid} errors=${JSON.stringify(result.errors)}`);
  console.log(`  期望 valid=${c.expValid} errors=${JSON.stringify(c.expErrors)}`);
  console.log(`  [${ok ? 'OK' : 'FAIL'}]`);
}
console.log(allPassed ? '全部断言通过' : '存在断言失败');
