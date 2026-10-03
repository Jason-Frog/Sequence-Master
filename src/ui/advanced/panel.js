/**
 * 显示错误信息
 * @param {string} msg 错误信息
 */
export function displayError(msg) {
  const el = document.getElementById('advanced-error');
  if (el) {
    el.textContent = msg;
    el.classList.remove('hidden');
  }
}

/**
 * 清除错误信息
 */
export function clearError() {
  const el = document.getElementById('advanced-error');
  if (el) {
    el.textContent = '';
    el.classList.add('hidden');
  }
}

/**
 * 进阶模式参数面板
 * @returns {string} panel HTML 字符串
 */
export function renderAdvancedPanel() {
  return `
    <h2 class="text-2xl font-bold mb-2 text-slate-800">进阶模式</h2>
    <p class="text-slate-500 mb-6">混序解谜：有效物品+干扰项，双维度反馈</p>

    <form id="advanced-form" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">
          有效物品数 <span class="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="advanced-validLength"
          name="validLength"
          min="2"
          max="12"
          value="4"
          required
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <p class="text-xs text-slate-400 mt-1">谜底真实长度，范围：2-12</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">
          总物品数 <span class="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="advanced-totalItems"
          name="totalItems"
          min="2"
          max="12"
          value="6"
          required
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <p class="text-xs text-slate-400 mt-1">有效物品+干扰项总和，需 ≥ 有效物品数</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">
          最大回合数
        </label>
        <input
          type="number"
          id="advanced-maxRounds"
          name="maxRounds"
          min="1"
          placeholder="不限"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <p class="text-xs text-slate-400 mt-1">留空则不限回合</p>
      </div>

      <div id="advanced-error" class="hidden text-red-500 text-sm"></div>

      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
      >
        开始游戏
      </button>
    </form>
  `;
}

/**
 * 初始化进阶模式面板事件
 */
export function initAdvancedPanel() {
  const form = document.getElementById('advanced-form');
  if (!form) return;

  const validLengthInput = document.getElementById('advanced-validLength');
  const totalItemsInput = document.getElementById('advanced-totalItems');

  // 动态更新 totalItems 的 min 值
  validLengthInput?.addEventListener('input', () => {
    const validLength = parseInt(validLengthInput.value, 10);
    if (!isNaN(validLength) && validLength >= 2) {
      totalItemsInput.min = validLength;
      // 如果当前 totalItems 小于 validLength，自动更新
      const currentTotal = parseInt(totalItemsInput.value, 10);
      if (isNaN(currentTotal) || currentTotal < validLength) {
        totalItemsInput.value = Math.max(validLength + 2, currentTotal || validLength + 2);
      }
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();

    const validLength = parseInt(validLengthInput.value, 10);
    const totalItems = parseInt(totalItemsInput.value, 10);
    const maxRoundsInput = document.getElementById('advanced-maxRounds').value;
    const maxRounds = maxRoundsInput === '' ? null : parseInt(maxRoundsInput, 10);

    form.dispatchEvent(new CustomEvent('sm:submit-advanced', {
      detail: { validLength, totalItems, maxRounds },
      bubbles: true,
    }));
  });

  // 清除输入时的错误
  validLengthInput?.addEventListener('input', clearError);
  totalItemsInput?.addEventListener('input', clearError);
  document.getElementById('advanced-maxRounds')?.addEventListener('input', clearError);
}
