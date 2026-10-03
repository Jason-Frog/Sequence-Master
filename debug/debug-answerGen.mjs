import { generateBasicAnswer, generateAdvancedAnswer } from '../src/core/answerGen.js';
import { ITEM_POOL } from '../src/core/itemPool.js';

const RUNS = 5000;
const failures = [];

function check(cond, msg) {
  if (!cond) failures.push(msg);
}

console.log('=== debug-answerGen ===');
console.log(`物品池（${ITEM_POOL.length} 项）: ${ITEM_POOL.join(' ')}`);

for (const len of [2, 5, 12]) {
  const appear = new Map(ITEM_POOL.map((item) => [item, 0]));
  for (let r = 0; r < RUNS; r++) {
    const answer = generateBasicAnswer(len);
    check(answer.length === len, `长度错误: 期望 ${len} 实得 ${answer.length}`);
    check(new Set(answer).size === len, `谜底含重复物品: ${answer.join('')}`);
    check(answer.every((x) => ITEM_POOL.includes(x)), `谜底含池外物品: ${answer.join('')}`);
    answer.forEach((x) => appear.set(x, appear.get(x) + 1));
  }
  console.log(`\n长度 ${len} × ${RUNS} 次，每物品出现次数（期望≈${Math.round((RUNS * len) / ITEM_POOL.length)}）:`);
  console.log('  ' + ITEM_POOL.map((item) => `${item}:${appear.get(item)}`).join(' '));
  console.log(`  样例: ${[...Array(3)].map(() => generateBasicAnswer(len).join('')).join('  ')}`);
}

console.log('\n边界用例（应全部抛 RangeError）:');
for (const bad of [13, 1.5, '5', -1]) {
  try {
    generateBasicAnswer(bad);
    console.log(`  输入 ${JSON.stringify(bad)} (${typeof bad}) -> 未抛错【异常】`);
    failures.push(`边界用例未抛错: ${bad}`);
  } catch (e) {
    console.log(`  输入 ${JSON.stringify(bad)} (${typeof bad}) -> ${e.constructor.name}: ${e.message}`);
  }
}

console.log('\n=== 进阶模式 generateAdvancedAnswer ===');
const ADV_RUNS = 5000;

{
  const v = 4, t = 7;
  for (let r = 0; r < ADV_RUNS; r++) {
    const { answer, distractors } = generateAdvancedAnswer(v, t);
    check(answer.length === v, `有效4总7: answer 长度期望 ${v} 实得 ${answer.length}`);
    check(distractors.length === t - v, `有效4总7: distractors 长度期望 ${t - v} 实得 ${distractors.length}`);
    check(new Set(answer).size === v, `有效4总7: answer 含重复 ${answer.join('')}`);
    check(answer.every((x) => ITEM_POOL.includes(x)), `有效4总7: answer 含池外物品 ${answer.join('')}`);
    check(new Set([...answer, ...distractors]).size === t, `有效4总7: 合并后长度期望无重复 ${t}，实得 ${new Set([...answer, ...distractors]).size}`);
    check(distractors.every((x) => ITEM_POOL.includes(x) && !answer.includes(x)), `有效4总7: 干扰项含池外或与谜底重叠 ${distractors.join('')}`);
  }
  const s = generateAdvancedAnswer(v, t);
  console.log(`有效 ${v} 总 ${t} × ${ADV_RUNS} 次  样例 answer=[${s.answer.join(' ')}] distractors=[${s.distractors.join(' ')}]`);
}

{
  const v = 6, t = 6;
  for (let r = 0; r < ADV_RUNS; r++) {
    const { answer, distractors } = generateAdvancedAnswer(v, t);
    check(answer.length === v, `退化边界(无干扰项): answer 长度期望 ${v} 实得 ${answer.length}`);
    check(Array.isArray(distractors) && distractors.length === 0, `退化边界(无干扰项): distractors 应为空数组，实得 ${JSON.stringify(distractors)}`);
    check(new Set(answer).size === v, `退化边界(无干扰项): answer 含重复 ${answer.join('')}`);
    check(answer.every((x) => ITEM_POOL.includes(x)), `退化边界(无干扰项): answer 含池外物品`);
  }
  const s = generateAdvancedAnswer(v, t);
  console.log(`退化 有效 ${v} 总 ${t} × ${ADV_RUNS} 次  样例 answer=[${s.answer.join(' ')}] distractors=[]（期望恒空）`);
}

console.log('非法输入用例（应全部抛 RangeError）:');
for (const [v, t] of [[4, 3], [4, 13], [4, 6.5], ['4', 6], [0, 5], [4, null]]) {
  try {
    generateAdvancedAnswer(v, t);
    console.log(`  输入 (${v},${t}) -> 未抛错【异常】`);
    failures.push(`进阶非法输入未抛错: (${v},${t})`);
  } catch (e) {
    console.log(`  输入 (${JSON.stringify(v)},${JSON.stringify(t)}) -> ${e.constructor.name}: ${e.message}`);
  }
}

console.log(`\n本模块 debug 模式支持参数：无（随机性验证用例内置，基础 ${RUNS} 次/长度，进阶 ${ADV_RUNS} 次/用例组）`);
console.log(failures.length === 0 ? `全部断言通过（基础 3 长度 × ${RUNS} + 进阶 2 用例组 × ${ADV_RUNS} + 6 非法输入）` : `断言失败 ${failures.length} 条:\n  ${failures.join('\n  ')}`);
