export function createHistory() {
  const entries = [];

  return {
    record(guess, result) {
      if (!Array.isArray(guess) || guess.length === 0) {
        throw new RangeError('历史记录写入失败：猜测必须为非空数组');
      }
      if (result === null || typeof result !== 'object') {
        throw new RangeError('历史记录写入失败：反馈结果无效');
      }
      if (!Number.isInteger(result.exact) || !Number.isInteger(result.misplaced)) {
        throw new RangeError('历史记录写入失败：exact/misplaced 必须为整数');
      }

      entries.push(Object.freeze({
        round: entries.length + 1,
        guess: Object.freeze([...guess]),
        exact: result.exact,
        misplaced: result.misplaced,
      }));
    },

    getEntries() {
      return [...entries];
    },

    size() {
      return entries.length;
    },

    clear() {
      entries.length = 0;
    },
  };
}
