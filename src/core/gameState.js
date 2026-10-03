import { UNLIMITED_ROUNDS } from './appMeta.js';
import { compareGuess } from './compare.js';

export const GAME_STATUS = Object.freeze({ PLAYING: 'playing', WON: 'won', LOST: 'lost' });

export function createGameSession(config) {
  if (config === null || typeof config !== 'object') {
    throw new RangeError('对局创建失败：配置对象无效');
  }
  const { answer, maxRounds } = config;

  if (!Array.isArray(answer) || answer.length === 0 || new Set(answer).size !== answer.length) {
    throw new RangeError('对局创建失败：谜底必须为非空且无重复的数组');
  }
  if (maxRounds !== UNLIMITED_ROUNDS && (!Number.isInteger(maxRounds) || maxRounds < 1)) {
    throw new RangeError('对局创建失败：maxRounds 必须是不限回合(null)或正整数');
  }

  const state = {
    status: GAME_STATUS.PLAYING,
    currentRound: 0,
    roundsLeft: maxRounds === UNLIMITED_ROUNDS ? null : maxRounds,
    locked: false,
    lastResult: null,
  };

  return {
    submitGuess(guess) {
      if (state.status !== GAME_STATUS.PLAYING) {
        throw new Error('对局已结束，不能继续提交猜测');
      }
      if (state.locked) {
        throw new Error('对局操作已冻结，不能提交猜测');
      }
      const { exact, misplaced } = compareGuess(answer, guess);

      state.currentRound += 1;
      if (maxRounds !== UNLIMITED_ROUNDS) {
        state.roundsLeft = maxRounds - state.currentRound;
      }
      if (exact === answer.length) {
        state.status = GAME_STATUS.WON;
      } else if (maxRounds !== UNLIMITED_ROUNDS && state.roundsLeft === 0) {
        state.status = GAME_STATUS.LOST;
      }
      state.lastResult = Object.freeze({ exact, misplaced });
      return { exact, misplaced, status: state.status };
    },

    getState() {
      return {
        status: state.status,
        currentRound: state.currentRound,
        roundsLeft: state.roundsLeft,
        locked: state.locked,
        lastResult: state.lastResult ? { ...state.lastResult } : null,
      };
    },

    lock() {
      state.locked = true;
    },

    unlock() {
      state.locked = false;
    },
  };
}
