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

  const TAB_ACTIVE = 'tab-btn px-3 py-1.5 sm:px-4 sm:py-1 rounded bg-blue-600 text-white text-sm sm:text-base whitespace-nowrap';
  const TAB_IDLE = 'tab-btn px-3 py-1.5 sm:px-4 sm:py-1 rounded bg-slate-600 hover:bg-slate-500 text-sm sm:text-base whitespace-nowrap';

  function setActive(mode) {
    if (mode === GAME_MODES.BASIC) {
      tabBasic.className = TAB_ACTIVE;
      tabAdvanced.className = TAB_IDLE;
      panelBasic.classList.remove('hidden');
      panelAdvanced.classList.add('hidden');
    } else {
      tabAdvanced.className = TAB_ACTIVE;
      tabBasic.className = TAB_IDLE;
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
