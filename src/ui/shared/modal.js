import { GAME_STATUS } from '../../core/gameState.js';

export function showModal(status, historyEntries, mode) {
  const isWon = status === GAME_STATUS.WON;
  const modal = document.createElement('div');
  modal.id = 'result-modal';
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
      <div class="text-6xl mb-4">${isWon ? '🎉' : '😢'}</div>
      <h2 class="text-2xl font-bold mb-2 ${isWon ? 'text-green-600' : 'text-red-600'}">
        ${isWon ? '恭喜通关！' : '挑战失败'}
      </h2>
      <p class="text-slate-600 mb-4">
        ${isWon ? `用了 ${historyEntries.length} 轮猜出答案` : '回合耗尽，未能猜出答案'}
      </p>

      <div class="text-left bg-slate-50 rounded-lg p-4 mb-4 max-h-48 overflow-y-auto">
        <p class="text-sm font-medium text-slate-700 mb-2">历史记录：</p>
        ${historyEntries.map((entry, i) => `
          <div class="text-sm text-slate-600 py-1 px-2 rounded ${i === historyEntries.length - 1 ? 'bg-blue-50' : ''}">
            <span class="text-slate-400">${entry.round}.</span>
            ${entry.guess.join('')}
            <span class="text-green-600 ml-2">✓${entry.exact}</span>
            ${mode === 'advanced' ? `<span class="text-amber-600">↔${entry.misplaced}</span>` : ''}
          </div>
        `).join('')}
      </div>

      <div class="flex gap-2">
        <button id="modal-retry" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
          再来一局
        </button>
        <button id="modal-back" class="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg transition">
          返回设置
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('modal-retry').addEventListener('click', () => {
    modal.remove();
    document.dispatchEvent(new CustomEvent('sm:retry-game', { bubbles: true }));
  });

  document.getElementById('modal-back').addEventListener('click', () => {
    modal.remove();
    document.dispatchEvent(new CustomEvent('sm:reset-game', { bubbles: true }));
  });
}
