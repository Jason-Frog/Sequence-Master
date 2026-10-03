import { createHistory } from '../src/core/history.js';
import { createGameSession } from '../src/core/gameState.js';
import { generateBasicAnswer } from '../src/core/answerGen.js';
import { ITEM_POOL } from '../src/core/itemPool.js';

const failures = [];

function check(name, cond, detail) {
  if (!cond) failures.push(`${name} ${detail}`);
  console.log(`  [${cond ? 'OK' : 'FAIL'}] ${name} ${detail}`);
}

function expectThrow(name, fn, msgPart, ErrType = RangeError) {
  try {
    fn();
    check(name, false, '-> 未抛错');
  } catch (e) {
    check(name, e.constructor.name === ErrType.name && e.message.includes(msgPart), `-> ${e.constructor.name}: ${e.message}`);
  }
}

console.log('=== debug-history ===');
console.log('单元剧本:');

const h = createHistory();
check('H-初始 size=0', h.size() === 0, `实得 ${h.size()}`);

const g1 = ['🍎', '🍌', '🍇'];
h.record(g1, { exact: 1, misplaced: 1 });
g1[0] = '🍒';
h.record(['🍊', '🍓', '🍒'], { exact: 0, misplaced: 0 });
h.record(['🍎', '🍌', '🍇'], { exact: 3, misplaced: 0 });

const list = h.getEntries();
check('H-3轮字段', JSON.stringify(list) === JSON.stringify([
  { round: 1, guess: ['🍎', '🍌', '🍇'], exact: 1, misplaced: 1 },
  { round: 2, guess: ['🍊', '🍓', '🍒'], exact: 0, misplaced: 0 },
  { round: 3, guess: ['🍎', '🍌', '🍇'], exact: 3, misplaced: 0 },
]), `实得 ${JSON.stringify(list)}`);
check('H-源数组篡改不影响存量', list[0].guess[0] === '🍎', `实得 ${list[0].guess[0]}`);
check('H-条目已冻结', list.every((e) => Object.isFrozen(e)), `实得 ${list.map((e) => Object.isFrozen(e))}`);
check('H-条目guess已冻结', list.every((e) => Object.isFrozen(e.guess)), `实得 ${list.map((e) => Object.isFrozen(e.guess))}`);

let pushThrew = false;
try {
  list[0].guess.push('💣');
} catch {
  pushThrew = true;
}
check('H-改内部guess被拒', pushThrew && h.size() === 3, `抛错=${pushThrew} size=${h.size()}`);

list.push('外部污染');
check('H-getEntries数组改动不影响内部', h.size() === 3, `实得 ${h.size()}`);

expectThrow('H-guess为字符串', () => h.record('🍎🍌', { exact: 1, misplaced: 1 }), '非空数组');
expectThrow('H-guess为空数组', () => h.record([], { exact: 0, misplaced: 0 }), '非空数组');
expectThrow('H-result为null', () => h.record(['🍎'], null), '反馈结果无效');
expectThrow('H-exact为字符串', () => h.record(['🍎'], { exact: '1', misplaced: 0 }), '必须为整数');
expectThrow('H-misplaced为小数', () => h.record(['🍎'], { exact: 1, misplaced: 1.5 }), '必须为整数');
check('H-非法写入不产生条目', h.size() === 3, `实得 ${h.size()}`);

h.clear();
check('H-clear后size=0', h.size() === 0 && h.getEntries().length === 0, `实得 ${h.size()}`);

console.log('\n端到端一局（answer随机3，maxRounds=4，猜3轮）:');
const answer = generateBasicAnswer(3);
const session = createGameSession({ answer, maxRounds: 4 });
const hist = createHistory();

const wrong1 = [...answer].reverse();
const r1 = session.submitGuess(wrong1);
hist.record(wrong1, r1);

const fillers = ITEM_POOL.filter((x) => !answer.includes(x)).slice(0, 3);
const r2 = session.submitGuess(fillers);
hist.record(fillers, r2);

const r3 = session.submitGuess([...answer]);
hist.record([...answer], r3);

console.log(`  谜底: ${answer.join('')}`);
for (const e of hist.getEntries()) {
  console.log(`  第${e.round}轮  猜 ${e.guess.join('')}  exact=${e.exact} misplaced=${e.misplaced}`);
}
console.log(`  最终 state: ${JSON.stringify(session.getState())}`);

check('E2E-第1轮自洽', r1.exact + r1.misplaced === 3, `实得 ${r1.exact}/${r1.misplaced}`);
check('E2E-第2轮全错', r2.exact === 0 && r2.misplaced === 0, `实得 ${r2.exact}/${r2.misplaced}`);
check('E2E-第3轮通关', r3.exact === 3 && r3.status === 'won', `实得 ${r3.exact}/${r3.status}`);
check('E2E-历史3条且第3条exact=3', hist.size() === 3 && hist.getEntries()[2].exact === 3, `实得 size=${hist.size()}`);
expectThrow('E2E-通关后再猜', () => session.submitGuess([...answer]), '对局已结束', Error);

console.log('\n本模块 debug 模式支持参数：无（剧本内置）');
console.log(failures.length === 0 ? '全部断言通过' : `断言失败 ${failures.length} 条:\n  ${failures.join('\n  ')}`);
