import { ITEM_POOL } from './core/itemPool.js';
import { validateBasicConfig, validateAdvancedConfig } from './core/validate.js';
import { generateBasicAnswer, generateAdvancedAnswer } from './core/answerGen.js';
import { createGameSession, GAME_STATUS } from './core/gameState.js';
import { createHistory } from './core/history.js';
import { displayError as displayBasicError } from './ui/basic/panel.js';
import { displayError as displayAdvancedError } from './ui/advanced/panel.js';
import { initBasicPanel } from './ui/basic/panel.js';
import { initAdvancedPanel } from './ui/advanced/panel.js';
import { renderHeader } from './ui/shared/header.js';
import { initTabSwitch } from './ui/shared/tabSwitch.js';
import { renderBasicPanel } from './ui/basic/panel.js';
import { renderAdvancedPanel } from './ui/advanced/panel.js';
import { showGamePage, updateFeedback, updateHistory, updateRounds } from './ui/shared/gamePage.js';
import { showModal } from './ui/shared/modal.js';
import { GAME_MODES } from './core/appMeta.js';

// 模块级状态
let currentSession = null;
let currentHistory = null;
let currentMode = null;
let currentValidLength = 0;
let currentParams = null;

// DOM 元素
const headerEl = document.getElementById('header');
const panelBasicEl = document.getElementById('panel-basic');
const panelAdvancedEl = document.getElementById('panel-advanced');
const gamePageEl = document.getElementById('game-page');

// 初始化
headerEl.innerHTML = renderHeader();
panelBasicEl.innerHTML = renderBasicPanel();
panelAdvancedEl.innerHTML = renderAdvancedPanel();
initBasicPanel();
initAdvancedPanel();

// 清空游戏状态
function clearGameState() {
  currentSession = null;
  currentHistory = null;
  currentValidLength = 0;
  currentParams = null;
  gamePageEl.classList.add('hidden');
  gamePageEl.innerHTML = '';
}

// 显示面板视图（显式指定模式）
function showPanelView(mode) {
  if (mode === 'advanced') {
    panelAdvancedEl.classList.remove('hidden');
    panelBasicEl.classList.add('hidden');
  } else {
    panelBasicEl.classList.remove('hidden');
    panelAdvancedEl.classList.add('hidden');
  }
  currentMode = null;
}

initTabSwitch('basic', panelBasicEl, panelAdvancedEl, clearGameState);

// 事件处理：基础模式提交
document.addEventListener('sm:submit-basic', (e) => {
  const { sequenceLength, maxRounds } = e.detail;
  const result = validateBasicConfig({ sequenceLength, maxRounds }, ITEM_POOL.length);
  if (!result.valid) {
    displayBasicError(result.errors.join('；'));
    return;
  }
  const answer = generateBasicAnswer(sequenceLength);
  currentSession = createGameSession({ answer, maxRounds });
  currentHistory = createHistory();
  currentMode = 'basic';
  currentValidLength = sequenceLength;
  currentParams = { sequenceLength, maxRounds };
  showGamePage('basic', { validLength: sequenceLength, itemPool: answer, maxRounds });
});

// 事件处理：进阶模式提交
document.addEventListener('sm:submit-advanced', (e) => {
  const { validLength, totalItems, maxRounds } = e.detail;
  const result = validateAdvancedConfig({ validLength, totalItems, maxRounds }, ITEM_POOL.length);
  if (!result.valid) {
    displayAdvancedError(result.errors.join('；'));
    return;
  }
  const { answer, distractors } = generateAdvancedAnswer(validLength, totalItems);
  currentSession = createGameSession({ answer, maxRounds });
  currentHistory = createHistory();
  currentMode = 'advanced';
  currentValidLength = validLength;
  currentParams = { validLength, totalItems, maxRounds };
  showGamePage('advanced', { validLength, itemPool: [...answer, ...distractors], maxRounds });
});

// 事件处理：猜测提交
document.addEventListener('sm:submit-guess', (e) => {
  if (!currentSession) return;
  const guess = e.detail.guess;
  const { exact, misplaced, status } = currentSession.submitGuess(guess);
  currentHistory.record(guess, { exact, misplaced });
  updateFeedback(exact, misplaced, currentMode);
  updateHistory(currentHistory.getEntries(), currentMode);
  updateRounds(currentSession.getState().currentRound, currentParams.maxRounds);
  if (status !== GAME_STATUS.PLAYING) {
    showModal(status, currentHistory.getEntries(), currentMode);
  }
});

// 事件处理：重置游戏
document.addEventListener('sm:reset-game', () => {
  const modeToShow = currentMode || 'basic';
  clearGameState();
  showPanelView(modeToShow);
});

// 事件处理：再来一局
document.addEventListener('sm:retry-game', () => {
  if (!currentParams || !currentMode) return;

  if (currentMode === 'basic') {
    const { sequenceLength, maxRounds } = currentParams;
    const answer = generateBasicAnswer(sequenceLength);
    currentSession = createGameSession({ answer, maxRounds });
    currentHistory = createHistory();
    showGamePage('basic', { validLength: sequenceLength, itemPool: answer, maxRounds });
    updateRounds(0, maxRounds);
  } else {
    const { validLength, totalItems, maxRounds } = currentParams;
    const { answer, distractors } = generateAdvancedAnswer(validLength, totalItems);
    currentSession = createGameSession({ answer, maxRounds });
    currentHistory = createHistory();
    showGamePage('advanced', { validLength, itemPool: [...answer, ...distractors], maxRounds });
    updateRounds(0, maxRounds);
  }
});
