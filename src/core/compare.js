export function compareGuess(answer, guess) {
  if (!Array.isArray(answer) || !Array.isArray(guess)) {
    throw new RangeError('比对输入无效：谜底与猜测必须都是数组');
  }
  if (answer.length === 0) {
    throw new RangeError('比对输入无效：序列长度不能为 0');
  }
  if (answer.length !== guess.length) {
    throw new RangeError(`比对输入无效：长度不等（谜底 ${answer.length}，猜测 ${guess.length}）`);
  }

  let exact = 0;
  const restAnswer = [];
  const restGuess = [];
  for (let i = 0; i < answer.length; i++) {
    if (answer[i] === guess[i]) {
      exact++;
    } else {
      restAnswer.push(answer[i]);
      restGuess.push(guess[i]);
    }
  }

  const remaining = new Map();
  for (const item of restAnswer) {
    remaining.set(item, (remaining.get(item) || 0) + 1);
  }
  let misplaced = 0;
  for (const item of restGuess) {
    const count = remaining.get(item) || 0;
    if (count > 0) {
      misplaced++;
      remaining.set(item, count - 1);
    }
  }

  return { exact, misplaced };
}
