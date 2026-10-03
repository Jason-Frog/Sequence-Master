import { compareGuess } from '../src/core/compare.js';
import { generateBasicAnswer, generateAdvancedAnswer } from '../src/core/answerGen.js';

const failures = [];

console.log('=== debug-compare ===');
console.log('手工用例（期望值内置比对）:');

const cases = [
  { name: '全对', answer: ['🍎', '🍌', '🍇'], guess: ['🍎', '🍌', '🍇'], exact: 3, misplaced: 0 },
  { name: '全错（池内不同物品）', answer: ['🍎', '🍌'], guess: ['🍊', '🍓'], exact: 0, misplaced: 0 },
  { name: '部分对（猜中物品不在谜底）', answer: ['🍎', '🍌', '🍇'], guess: ['🍎', '🍌', '🍉'], exact: 2, misplaced: 0 },
  { name: '位置交错', answer: ['🍎', '🍌'], guess: ['🍌', '🍎'], exact: 0, misplaced: 2 },
  { name: '一对错位+其余全对', answer: ['🍎', '🍌', '🍇'], guess: ['🍌', '🍎', '🍇'], exact: 1, misplaced: 2 },
  { name: '循环错位（长度4）', answer: ['🍎', '🍌', '🍇', '🍉'], guess: ['🍉', '🍌', '🍎', '🍇'], exact: 1, misplaced: 3 },
  { name: '猜测含重复：谜底🍎🍌🍇 猜🍎🍎🍌', answer: ['🍎', '🍌', '🍇'], guess: ['🍎', '🍎', '🍌'], exact: 1, misplaced: 1 },
  { name: '猜测含重复：谜底🍎🍌🍇 猜🍎🍎🍎', answer: ['🍎', '🍌', '🍇'], guess: ['🍎', '🍎', '🍎'], exact: 1, misplaced: 0 },
  { name: '猜测含重复：谜底🍎🍌🍇 猜🍒🍒🍒', answer: ['🍎', '🍌', '🍇'], guess: ['🍒', '🍒', '🍒'], exact: 0, misplaced: 0 },
];

for (const c of cases) {
  const r = compareGuess(c.answer, c.guess);
  const ok = r.exact === c.exact && r.misplaced === c.misplaced;
  if (!ok) failures.push(`${c.name}: 期望 ${c.exact}/${c.misplaced} 实得 ${r.exact}/${r.misplaced}`);
  console.log(`  [${ok ? 'OK' : 'FAIL'}] ${c.name}: 谜底 ${c.answer.join('')} 猜 ${c.guess.join('')} -> exact=${r.exact} misplaced=${r.misplaced}（期望 ${c.exact}/${c.misplaced}）`);
}

console.log('\n异常用例（应全部抛 RangeError）:');
const badCases = [
  { name: '空数组', answer: [], guess: [] },
  { name: '长度不等', answer: ['🍎', '🍌'], guess: ['🍎'] },
  { name: 'answer 非数组（字符串）', answer: '🍎🍌', guess: ['🍎', '🍌'] },
  { name: 'guess 非数组（null）', answer: ['🍎'], guess: null },
];
for (const c of badCases) {
  try {
    compareGuess(c.answer, c.guess);
    failures.push(`异常用例未抛错: ${c.name}`);
    console.log(`  [FAIL] ${c.name} -> 未抛错`);
  } catch (e) {
    console.log(`  [${e.constructor.name === 'RangeError' ? 'OK' : 'FAIL'}] ${c.name} -> ${e.constructor.name}: ${e.message}`);
    if (e.constructor.name !== 'RangeError') failures.push(`${c.name} 抛的不是 RangeError`);
  }
}

console.log(`\n随机自洽 1000 次（断言 exact+misplaced === len；全同时 exact===len 且 misplaced===0）:`);
let shuffleOk = 0;
let identityOk = 0;
for (let i = 0; i < 500; i++) {
  const answer = generateBasicAnswer(5);
  const guess = [...answer].sort(() => Math.random() - 0.5);
  const { exact, misplaced } = compareGuess(answer, guess);
  if (exact + misplaced === 5) shuffleOk++;
  else failures.push(`重排自洽失败: 谜底 ${answer.join('')} 猜 ${guess.join('')} -> ${exact}/${misplaced}`);
}
for (let i = 0; i < 500; i++) {
  const answer = generateBasicAnswer(5);
  const { exact, misplaced } = compareGuess(answer, [...answer]);
  if (exact === 5 && misplaced === 0) identityOk++;
  else failures.push(`全同用例失败: 谜底 ${answer.join('')} -> ${exact}/${misplaced}`);
}
console.log(`  重排自洽 ${shuffleOk}/500 通过；全同判定 ${identityOk}/500 通过`);

console.log('\n=== 进阶双维度用例组（干扰项入池，期望值写死）===');
const ADV_ANSWER = ['🍎', '🍌', '🍇', '🍉'];
const advCases = [
  { name: '干扰项不计分：猜⭐🌙⚡🍎', guess: ['⭐', '🌙', '⚡', '🍎'], exact: 0, misplaced: 1 },
  { name: '全错位重排：猜🍉🍇🍌🍎', guess: ['🍉', '🍇', '🍌', '🍎'], exact: 0, misplaced: 4 },
  { name: '一对全对+干扰：猜🍎⭐🍌🌙', guess: ['🍎', '⭐', '🍌', '🌙'], exact: 1, misplaced: 1 },
  { name: '先剔全对再交集：猜🍌🍎🍇⭐', guess: ['🍌', '🍎', '🍇', '⭐'], exact: 1, misplaced: 2 },
];
for (const c of advCases) {
  const r = compareGuess(ADV_ANSWER, c.guess);
  const ok = r.exact === c.exact && r.misplaced === c.misplaced;
  if (!ok) failures.push(`进阶 ${c.name}: 期望 ${c.exact}/${c.misplaced} 实得 ${r.exact}/${r.misplaced}`);
  console.log(`  [${ok ? 'OK' : 'FAIL'}] ${c.name}: 谜底 ${ADV_ANSWER.join('')} -> exact=${r.exact} misplaced=${r.misplaced}（期望 ${c.exact}/${c.misplaced}）`);
}

const ADV_ROUNDS = 500;
let swapOk = 0;
let distractorOnlyOk = 0;
let upperBoundOk = 0;
let advSample = null;
for (let i = 0; i < ADV_ROUNDS; i++) {
  const { answer, distractors } = generateAdvancedAnswer(4, 8);
  if (!advSample) advSample = { answer, distractors };

  const swapGuess = [answer[1], answer[0], answer[2], answer[3]];
  const s = compareGuess(answer, swapGuess);
  if (s.exact === 2 && s.misplaced === 2) swapOk++;
  else failures.push(`交换前两位: 谜底 ${answer.join('')} 猜 ${swapGuess.join('')} -> ${s.exact}/${s.misplaced}，期望 2/2`);

  const dGuess = [distractors[0], distractors[1], distractors[2], distractors[3]];
  const dg = compareGuess(answer, dGuess);
  if (dg.exact === 0 && dg.misplaced === 0) distractorOnlyOk++;
  else failures.push(`纯干扰项猜测: 谜底 ${answer.join('')} 猜 ${dGuess.join('')} -> ${dg.exact}/${dg.misplaced}，期望 0/0`);

  const sum = compareGuess(answer, [answer[2], distractors[0], answer[0], distractors[1]]);
  if (sum.exact + sum.misplaced <= answer.length) upperBoundOk++;
  else failures.push(`上界破坏: exact+misplaced=${sum.exact + sum.misplaced} > ${answer.length}`);
}
console.log(`  随机不变量 × ${ADV_ROUNDS}（有效4 总8，answer/distractors 每轮新生成）:`);
console.log(`    交换前两位恒 2/2：${swapOk}/${ADV_ROUNDS}`);
console.log(`    纯干扰项恒 0/0：${distractorOnlyOk}/${ADV_ROUNDS}`);
console.log(`    混合猜测 exact+misplaced ≤ 4：${upperBoundOk}/${ADV_ROUNDS}`);
console.log(`    样例谜底 [${advSample.answer.join(' ')}] 干扰 [${advSample.distractors.join(' ')}]`);

console.log('\n本模块 debug 模式支持参数：无（用例内置，进阶随机组 ' + ADV_ROUNDS + ' 次）');
console.log(failures.length === 0 ? '全部断言通过（基础 9 + 异常 4 + 随机 1000 + 进阶固定 4 + 进阶随机 1500）' : `断言失败 ${failures.length} 条:\n  ${failures.join('\n  ')}`);
