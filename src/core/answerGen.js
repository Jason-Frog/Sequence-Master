import { ITEM_POOL } from './itemPool.js';

export function generateBasicAnswer(sequenceLength, pool = ITEM_POOL) {
  if (!Array.isArray(pool) || pool.length === 0 || new Set(pool).size !== pool.length) {
    throw new RangeError('物品池无效：必须为非空且无重复的数组');
  }
  if (!Number.isInteger(sequenceLength) || sequenceLength < 1 || sequenceLength > pool.length) {
    throw new RangeError(`序列长度无效：必须是 1 到 ${pool.length} 之间的正整数`);
  }

  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, sequenceLength);
}

export function generateAdvancedAnswer(validLength, totalItems, pool = ITEM_POOL) {
  if (!Array.isArray(pool) || pool.length === 0 || new Set(pool).size !== pool.length) {
    throw new RangeError('物品池无效：必须为非空且无重复的数组');
  }
  if (!Number.isInteger(validLength) || validLength < 1 || validLength > pool.length) {
    throw new RangeError(`有效物品数无效：必须是 1 到 ${pool.length} 之间的正整数`);
  }
  if (!Number.isInteger(totalItems) || totalItems < validLength || totalItems > pool.length) {
    throw new RangeError(`总物品数无效：必须是 ${validLength} 到 ${pool.length} 之间的整数`);
  }

  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return {
    answer: shuffled.slice(0, validLength),
    distractors: shuffled.slice(validLength, totalItems),
  };
}
