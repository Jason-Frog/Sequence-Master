import { UNLIMITED_ROUNDS } from './appMeta.js';

export function validateBasicConfig(config, poolSize) {
  if (config === null || typeof config !== 'object') {
    return { valid: false, errors: ['配置对象无效'] };
  }

  if (!Number.isInteger(poolSize) || poolSize <= 0) {
    return { valid: false, errors: ['物品池大小无效（开发侧错误）'] };
  }

  const errors = [];
  const { sequenceLength, maxRounds } = config;

  if (typeof sequenceLength !== 'number') {
    errors.push('序列长度必须是数字');
  } else if (!Number.isInteger(sequenceLength)) {
    errors.push('序列长度必须是整数');
  } else if (sequenceLength < 2) {
    errors.push('序列长度至少为 2');
  } else if (sequenceLength > poolSize) {
    errors.push(`序列长度不能超过物品池大小 ${poolSize}`);
  }

  if (maxRounds !== UNLIMITED_ROUNDS) {
    if (typeof maxRounds !== 'number') {
      errors.push('回合数必须是不限回合(null)或数字');
    } else if (!Number.isInteger(maxRounds)) {
      errors.push('回合数必须是整数');
    } else if (maxRounds < 1) {
      errors.push('回合数至少为 1');
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateAdvancedConfig(config, poolSize) {
  if (config === null || typeof config !== 'object') {
    return { valid: false, errors: ['配置对象无效'] };
  }

  if (!Number.isInteger(poolSize) || poolSize <= 0) {
    return { valid: false, errors: ['物品池大小无效（开发侧错误）'] };
  }

  const errors = [];
  const { validLength, totalItems, maxRounds } = config;

  if (typeof validLength !== 'number') {
    errors.push('有效物品数必须是数字');
  } else if (!Number.isInteger(validLength)) {
    errors.push('有效物品数必须是整数');
  } else if (validLength < 2) {
    errors.push('有效物品数至少为 2');
  } else if (validLength > poolSize) {
    errors.push(`有效物品数不能超过物品池大小 ${poolSize}`);
  }

  const validLengthIsInt = Number.isInteger(validLength);
  if (typeof totalItems !== 'number') {
    errors.push('总物品数必须是数字');
  } else if (!Number.isInteger(totalItems)) {
    errors.push('总物品数必须是整数');
  } else if (validLengthIsInt && totalItems < validLength) {
    errors.push('总物品数不能少于有效物品数');
  } else if (totalItems > poolSize) {
    errors.push(`总物品数不能超过物品池大小 ${poolSize}`);
  }

  if (maxRounds !== UNLIMITED_ROUNDS) {
    if (typeof maxRounds !== 'number') {
      errors.push('回合数必须是不限回合(null)或数字');
    } else if (!Number.isInteger(maxRounds)) {
      errors.push('回合数必须是整数');
    } else if (maxRounds < 1) {
      errors.push('回合数至少为 1');
    }
  }

  return { valid: errors.length === 0, errors };
}
