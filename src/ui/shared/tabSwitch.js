import { GAME_MODES } from '../../core/appMeta.js';

/**
 * 初始化 Tab 切换逻辑
 * @param {string} initialMode - 初始模式 'basic' | 'advanced'
 * @param {HTMLElement} panelBasic - 基础模式面板元素
 * @param {HTMLElement} panelAdvanced - 进阶模式面板元素
 * @param {function} onTabSwitch - 切换 tab 时的回调，用于清空游戏状态
 */
export function initTabSwitch(initialMode, panelBasic, panelAdvanced, onTabSwitch) {
  const tabBasic = document.getElementById('tab-basic');
  const tabAdvanced = document.getElementById('tab-advanced');

  function setActive(mode) {
    if (mode === GAME_MODES.BASIC) {
      tabBasic.className = 'tab-btn px-4 py-1 rounded bg-blue-600 text-white';
      tabAdvanced.className = 'tab-btn px-4 py-1 rounded bg-slate-600 hover:bg-slate-500';
      panelBasic.classList.remove('hidden');
      panelAdvanced.classList.add('hidden');
    } else {
      tabAdvanced.className = 'tab-btn px-4 py-1 rounded bg-blue-600 text-white';
      tabBasic.className = 'tab-btn px-4 py-1 rounded bg-slate-600 hover:bg-slate-500';
      panelAdvanced.classList.remove('hidden');
      panelBasic.classList.add('hidden');
    }
  }

  tabBasic.addEventListener('click', () => {
    onTabSwitch?.();
    setActive(GAME_MODES.BASIC);
  });
  tabAdvanced.addEventListener('click', () => {
    onTabSwitch?.();
    setActive(GAME_MODES.ADVANCED);
  });

  // 初始化显示
  setActive(initialMode);
}
