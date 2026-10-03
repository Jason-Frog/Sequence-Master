/**
 * 显示错误信息
 * @param {string} msg 错误信息
 */
export function displayError(msg) {
  const el = document.getElementById('basic-error');
  if (el) {
    el.textContent = msg;
    el.classList.remove('hidden');
  }
}

/**
 * 清除错误信息
 */
export function clearError() {
  const el = document.getElementById('basic-error');
  if (el) {
    el.textContent = '';
    el.classList.add('hidden');
  }
}

/**
 * 基础模式参数面板
 * @returns {string} panel HTML 字符串
 */
export function renderBasicPanel() {
  return `
    <h2 class="text-2xl font-bold mb-2 text-slate-800">基础模式</h2>
    <p class="text-slate-500 mb-6">顺序推演：展示全部物品，推理正确排列顺序</p>

    <form id="basic-form" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">
          序列长度 <span class="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="basic-sequenceLength"
          name="sequenceLength"
          min="2"
          max="12"
          value="4"
          required
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <p class="text-xs text-slate-400 mt-1">范围：2-12</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">
          最大回合数
        </label>
        <input
          type="number"
          id="basic-maxRounds"
          name="maxRounds"
          min="1"
          placeholder="不限"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <p class="text-xs text-slate-400 mt-1">留空则不限回合</p>
      </div>

      <div id="basic-error" class="hidden text-red-500 text-sm"></div>

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
 * 初始化基础模式面板事件
 */
export function initBasicPanel() {
  const form = document.getElementById('basic-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();

    const sequenceLength = parseInt(document.getElementById('basic-sequenceLength').value, 10);
    const maxRoundsInput = document.getElementById('basic-maxRounds').value;
    const maxRounds = maxRoundsInput === '' ? null : parseInt(maxRoundsInput, 10);

    form.dispatchEvent(new CustomEvent('sm:submit-basic', {
      detail: { sequenceLength, maxRounds },
      bubbles: true,
    }));
  });

  // 清除输入时的错误
  document.getElementById('basic-sequenceLength')?.addEventListener('input', clearError);
  document.getElementById('basic-maxRounds')?.addEventListener('input', clearError);
}
