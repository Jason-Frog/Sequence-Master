import { createGameSession, GAME_STATUS } from '../src/core/gameState.js';
import { generateAdvancedAnswer } from '../src/core/answerGen.js';

const failures = [];

function check(name, cond, detail) {
  if (!cond) failures.push(`${name} ${detail}`);
  console.log(`  [${cond ? 'OK' : 'FAIL'}] ${name} ${detail}`);
}

function dump(tag, state) {
  console.log(`    ${tag} state: status=${state.status} round=${state.currentRound} left=${state.roundsLeft} locked=${state.locked} last=${JSON.stringify(state.lastResult)}`);
}

function expectThrow(name, fn, msgPart) {
  try {
    fn();
    check(name, false, '-> 未抛错');
  } catch (e) {
    check(name, e.message.includes(msgPart), `-> ${e.constructor.name}: ${e.message}`);
  }
}

const ANSWER3 = ['🍎', '🍌', '🍇'];

console.log('=== debug-gameState ===');

console.log('\n剧本A：有限回合通关（answer=🍎🍌🍇 maxRounds=5）');
const a = createGameSession({ answer: ANSWER3, maxRounds: 5 });
dump('初始', a.getState());
const a1 = a.submitGuess(['🍎', '🍒', '🍌']);
dump('第1轮 猜🍎🍒🍌', a.getState());
check('A-1轮结果', a1.exact === 1 && a1.misplaced === 1 && a1.status === GAME_STATUS.PLAYING, `实得 ${a1.exact}/${a1.misplaced}/${a1.status} 期望 1/1/playing`);
const a2 = a.submitGuess(ANSWER3);
dump('第2轮 全对', a.getState());
check('A-通关', a2.exact === 3 && a2.status === GAME_STATUS.WON, `实得 exact=${a2.exact} status=${a2.status}`);
expectThrow('A-通关后再猜', () => a.submitGuess(ANSWER3), '对局已结束');

console.log('\n剧本B：回合耗尽判负（answer=🍎🍌 maxRounds=3）');
const b = createGameSession({ answer: ['🍎', '🍌'], maxRounds: 3 });
check('B-初始left=3', b.getState().roundsLeft === 3, `实得 ${b.getState().roundsLeft}`);
const b1 = b.submitGuess(['🍌', '🍎']);
const b2 = b.submitGuess(['🍊', '🍓']);
const b3 = b.submitGuess(['🍎', '🍊']);
dump('第3轮后', b.getState());
check('B-三轮计数', [b1, b2, b3].map((r) => `${r.exact}/${r.misplaced}`).join(' ') === '0/2 0/0 1/0', `实得 ${[b1, b2, b3].map((r) => `${r.exact}/${r.misplaced}`).join(' ')}`);
check('B-判负', b.getState().status === GAME_STATUS.LOST && b.getState().roundsLeft === 0, `实得 ${b.getState().status}/${b.getState().roundsLeft}`);

console.log('\n剧本C：不限回合 20 轮（answer=🍎🍌🍇 maxRounds=null）');
const c = createGameSession({ answer: ANSWER3, maxRounds: null });
for (let i = 0; i < 20; i++) c.submitGuess(['🍒', '🍒', '🍒']);
const cs = c.getState();
dump('20轮后', cs);
check('C-恒playing且left=null', cs.status === GAME_STATUS.PLAYING && cs.roundsLeft === null && cs.currentRound === 20, `实得 ${cs.status}/${cs.roundsLeft}/${cs.currentRound}`);

console.log('\n剧本D：冻结/解冻');
const d = createGameSession({ answer: ANSWER3, maxRounds: 5 });
d.lock();
dump('lock后', d.getState());
expectThrow('D-冻结时提交', () => d.submitGuess(ANSWER3), '已冻结');
check('D-非法提交不吃回合', d.getState().currentRound === 0, `实得 round=${d.getState().currentRound}`);
d.unlock();
d.submitGuess(ANSWER3);
check('D-解冻后提交成功', d.getState().status === GAME_STATUS.WON, `实得 ${d.getState().status}`);

console.log('\n剧本E：非法输入');
expectThrow('E-创建config=null', () => createGameSession(null), '配置对象无效');
expectThrow('E-谜底含重复', () => createGameSession({ answer: ['🍎', '🍎'], maxRounds: 5 }), '非空且无重复');
expectThrow("E-maxRounds='5'", () => createGameSession({ answer: ANSWER3, maxRounds: '5' }), '正整数');
const e = createGameSession({ answer: ANSWER3, maxRounds: 5 });
expectThrow('E-猜测长度不等', () => e.submitGuess(['🍎']), '长度不等');
check('E-非法猜测不吃回合', e.getState().currentRound === 0 && e.getState().roundsLeft === 5, `实得 round=${e.getState().currentRound} left=${e.getState().roundsLeft}`);

console.log('\n剧本F：快照防篡改');
const f = createGameSession({ answer: ANSWER3, maxRounds: 5 });
f.submitGuess(['🍎', '🍒', '🍌']);
const snap = f.getState();
snap.lastResult.exact = 999;
snap.currentRound = 999;
snap.status = 'hacked';
const real = f.getState();
check('F-内部不受外部修改影响', real.lastResult.exact === 1 && real.currentRound === 1 && real.status === GAME_STATUS.PLAYING, `实得 last.exact=${real.lastResult.exact} round=${real.currentRound} status=${real.status}`);

console.log('\n剧本G：进阶会话集成（每线 ×200，谜底下标构造猜测，期望值死值）');
{
  const RUNS_G = 200;
  let winOk = 0;
  let loseOk = 0;
  let degenOk = 0;
  let sample = null;

  for (let i = 0; i < RUNS_G; i++) {
    const { answer: a, distractors: d } = generateAdvancedAnswer(4, 7);

    const w = createGameSession({ answer: a, maxRounds: 5 });
    const w1 = w.submitGuess([a[1], a[0], d[0], d[1]]);
    const w2 = w.submitGuess([a[3], a[2], a[1], a[0]]);
    const w3 = w.submitGuess([...a]);
    let wErr = '';
    try { w.submitGuess([...a]); } catch (e) { wErr = e.message; }
    const ws = w.getState();
    const winPass =
      w1.exact === 0 && w1.misplaced === 2 && w1.status === GAME_STATUS.PLAYING &&
      w2.exact === 0 && w2.misplaced === 4 && w2.status === GAME_STATUS.PLAYING &&
      w3.exact === 4 && w3.status === GAME_STATUS.WON &&
      ws.currentRound === 3 && ws.roundsLeft === 2 &&
      wErr.includes('对局已结束');
    if (winPass) {
      winOk++;
      if (!sample) sample = { a, d, w1, w2, w3, ws };
    } else {
      failures.push(`G-通关线 第${i + 1}轮: ${w1.exact}/${w1.misplaced} ${w2.exact}/${w2.misplaced} ${w3.exact}/${w3.status} left=${ws.roundsLeft} err=${wErr || '未抛错'} 期望 0/2 0/4 4/won left=2 对局已结束`);
    }

    const l = createGameSession({ answer: a, maxRounds: 2 });
    const l1 = l.submitGuess([a[1], a[0], d[0], d[1]]);
    const l2 = l.submitGuess([a[3], a[2], a[1], a[0]]);
    const ls = l.getState();
    if (l1.status === GAME_STATUS.PLAYING && l2.status === GAME_STATUS.LOST && ls.roundsLeft === 0 && ls.currentRound === 2) {
      loseOk++;
    } else {
      failures.push(`G-判负线 第${i + 1}轮: ${l1.status}/${l2.status}/left=${ls.roundsLeft}/round=${ls.currentRound} 期望 playing/lost/0/2`);
    }

    const { answer: da } = generateAdvancedAnswer(4, 4);
    const g = createGameSession({ answer: da, maxRounds: 5 });
    const g1 = g.submitGuess([da[1], da[0], da[2], da[3]]);
    const gs = g.getState();
    if (g1.exact === 2 && g1.misplaced === 2 && g1.status === GAME_STATUS.PLAYING && gs.roundsLeft === 4) {
      degenOk++;
    } else {
      failures.push(`G-退化线 第${i + 1}轮: ${g1.exact}/${g1.misplaced}/${g1.status}/left=${gs.roundsLeft} 期望 2/2/playing/4`);
    }
  }

  console.log(`  [${winOk === RUNS_G ? 'OK' : 'FAIL'}] G-通关线（0/2→0/4→4全对WON→再猜抛「对局已结束」，round=3 left=2）：${winOk}/${RUNS_G}`);
  console.log(`  [${loseOk === RUNS_G ? 'OK' : 'FAIL'}] G-判负线（maxRounds=2 连错两轮→LOST left=0）：${loseOk}/${RUNS_G}`);
  console.log(`  [${degenOk === RUNS_G ? 'OK' : 'FAIL'}] G-退化线（总=有效 无干扰，交换两位→2/2 playing left=4）：${degenOk}/${RUNS_G}`);
  if (sample) {
    console.log(`    样例 谜底 [${sample.a.join(' ')}] 干扰 [${sample.d.join(' ')}] 三轮反馈 ${sample.w1.exact}/${sample.w1.misplaced} → ${sample.w2.exact}/${sample.w2.misplaced} → ${sample.w3.exact}/${sample.w3.status}`);
    dump('通关后', sample.ws);
  }
}

console.log('\n本模块 debug 模式支持参数：无（剧本内置，进阶剧本G 每线 200 轮）');
console.log(failures.length === 0 ? '全部断言通过（剧本A-F + 剧本G 3线×200）' : `断言失败 ${failures.length} 条:\n  ${failures.join('\n  ')}`);
