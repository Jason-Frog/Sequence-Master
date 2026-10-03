import { ITEM_POOL } from '../../core/itemPool.js';

let slots = [];
let itemPool = [];
let validLength = 0;
let pendingItem = null; // 待放置物品

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getEmptySlotCount() {
  return slots.filter(s => s === null).length;
}

function renderSlots() {
  const slotsContainer = document.getElementById('slots');
  const submitBtn = document.getElementById('submit-guess');

  slotsContainer.innerHTML = slots.map((item, i) => {
    const isEmpty = item === null;
    const isPending = pendingItem !== null;
    return `
      <div class="slot w-14 h-14 border-2 rounded-lg flex items-center justify-center text-2xl
                  ${isEmpty ? 'border-slate-300 bg-slate-50 cursor-pointer hover:border-blue-400' : 'bg-blue-50 cursor-pointer hover:bg-blue-100 border-blue-400'}
                  ${isEmpty && isPending ? 'border-dashed border-blue-400 bg-blue-50' : ''}"
           data-index="${i}">
        ${item || ''}
      </div>
    `;
  }).join('');

  // 槽位点击
  slotsContainer.querySelectorAll('.slot').forEach(slot => {
    slot.addEventListener('click', () => {
      const idx = parseInt(slot.dataset.index, 10);

      if (slots[idx] !== null) {
        // 槽位有物品：无待放置时，物品移回池
        if (pendingItem === null) {
          const removedItem = slots[idx];
          slots[idx] = null;
          itemPool.push(removedItem);
          itemPool = shuffle(itemPool);
          renderAll();
        }
        // 有待放置时忽略
      } else {
        // 槽位空
        if (pendingItem !== null) {
          // 有待放置
          const emptyCount = getEmptySlotCount();
          if (emptyCount === 1) {
            // 空位=1，直接放入
            slots[idx] = pendingItem;
            itemPool = itemPool.filter(i => i !== pendingItem);
            pendingItem = null;
          } else {
            // 空位>1，放入目标槽位
            slots[idx] = pendingItem;
            itemPool = itemPool.filter(i => i !== pendingItem);
            pendingItem = null;
          }
          renderAll();
        }
      }
    });
  });

  // 提交按钮状态（允许未填满提交）
  const hasAnyItem = slots.some(s => s !== null);
  submitBtn.disabled = !hasAnyItem;
  submitBtn.classList.toggle('opacity-50', !hasAnyItem);
  submitBtn.classList.toggle('cursor-not-allowed', !hasAnyItem);
}

function renderItemPool() {
  const poolContainer = document.getElementById('item-pool');
  poolContainer.innerHTML = itemPool.map((item, i) => `
    <div class="item w-12 h-12 rounded-lg flex items-center justify-center text-2xl cursor-pointer transition
                ${pendingItem === item ? 'bg-blue-200 ring-4 ring-blue-400' : 'bg-amber-100 hover:bg-amber-200'}"
         data-item="${item}">
      ${item}
    </div>
  `).join('');

  // 物品点击
  poolContainer.querySelectorAll('.item').forEach(itemEl => {
    itemEl.addEventListener('click', () => {
      const item = itemEl.dataset.item;
      const emptyCount = getEmptySlotCount();

      if (emptyCount === 0) {
        // 无空位，无反应
        return;
      }

      if (pendingItem === item) {
        // 再点同一个，取消选中
        pendingItem = null;
      } else {
        // 点不同物品
        if (emptyCount === 1) {
          // 空位=1，直接放入
          const emptyIdx = slots.findIndex(s => s === null);
          slots[emptyIdx] = item;
          itemPool = itemPool.filter(i => i !== item);
        } else {
          // 空位>1，进入待放置
          pendingItem = item;
        }
      }
      renderAll();
    });
  });
}

function renderFeedback(exact, misplaced, mode) {
  const feedbackEl = document.getElementById('feedback');
  feedbackEl.innerHTML = `
    <div class="flex gap-6 justify-center text-lg font-medium">
      <div class="text-green-600">✓ 位置正确：<span class="text-2xl">${exact}</span></div>
      ${mode === 'advanced' ? `
        <div class="text-amber-600">↔ 位置错误：<span class="text-2xl">${misplaced}</span></div>
      ` : ''}
    </div>
  `;
}

function renderHistory(entries, mode) {
  const historyEl = document.getElementById('history-list');
  if (!entries || entries.length === 0) {
    historyEl.innerHTML = '<p class="text-slate-400 text-sm">暂无记录</p>';
    return;
  }
  historyEl.innerHTML = entries.map((entry, i) => `
    <div class="flex items-center gap-2 text-sm py-1 px-2 rounded ${i === entries.length - 1 ? 'bg-blue-50' : ''}">
      <span class="text-slate-400 w-6">${entry.round}.</span>
      <span>${entry.guess.join('')}</span>
      <span class="text-green-600 ml-2">✓${entry.exact}</span>
      ${mode === 'advanced' ? `<span class="text-amber-600">↔${entry.misplaced}</span>` : ''}
    </div>
  `).join('');
}

function renderAll() {
  renderSlots();
  renderItemPool();
  renderStatusHint();
}

function renderStatusHint() {
  const hintEl = document.getElementById('status-hint');
  const emptyCount = getEmptySlotCount();

  if (pendingItem !== null) {
    hintEl.textContent = `已选中 ${pendingItem}，请点击目标槽位`;
    hintEl.className = 'text-blue-600 text-sm mb-4 text-center';
  } else if (emptyCount === 0) {
    hintEl.textContent = '槽位已满，点击「提交猜测」';
    hintEl.className = 'text-slate-500 text-sm mb-4 text-center';
  } else {
    hintEl.textContent = `点击物品，再点击槽位放置（${emptyCount}个空位）`;
    hintEl.className = 'text-slate-500 text-sm mb-4 text-center';
  }
}

export function showGamePage(mode, data) {
  validLength = data.validLength;
  slots = Array(validLength).fill(null);
  pendingItem = null;
  itemPool = shuffle([...data.itemPool]);

  const gamePageEl = document.getElementById('game-page');
  const panelBasicEl = document.getElementById('panel-basic');
  const panelAdvancedEl = document.getElementById('panel-advanced');

  panelBasicEl.classList.add('hidden');
  panelAdvancedEl.classList.add('hidden');
  gamePageEl.classList.remove('hidden');
  gamePageEl.innerHTML = '';

  const roundsHtml = data.maxRounds !== null ? `
    <div id="rounds-info" class="text-sm text-slate-500">
      <span>已尝试 0 次</span> | <span>剩余 ${data.maxRounds} 次提交</span>
    </div>
  ` : '';

  gamePageEl.innerHTML = `
    <div class="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-slate-800">${mode === 'basic' ? '基础模式' : '进阶模式'}</h2>
        <button id="back-to-panel" class="text-sm text-slate-500 hover:text-slate-700">← 返回设置</button>
      </div>
      ${roundsHtml}
      <p id="status-hint" class="text-slate-500 text-sm mb-4 text-center"></p>

      <div class="mb-6">
        <p class="text-sm font-medium text-slate-700 mb-2">你的猜测：</p>
        <div id="slots" class="flex gap-2 justify-center flex-wrap"></div>
      </div>

      <div class="mb-6">
        <p class="text-sm font-medium text-slate-700 mb-2">物品池：</p>
        <div id="item-pool" class="flex gap-2 justify-center flex-wrap"></div>
      </div>

      <div id="feedback" class="mb-4 text-center min-h-8"></div>

      <div class="mb-4">
        <p class="text-sm font-medium text-slate-700 mb-2">历史记录：</p>
        <div id="history-list" class="max-h-32 overflow-y-auto text-slate-600"></div>
      </div>

      <button
        id="submit-guess"
        disabled
        class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
               text-white font-medium py-2 px-4 rounded-lg transition"
      >
        提交猜测
      </button>
    </div>
  `;

  renderAll();

  // 提交猜测（空槽位用占位符填充）
  document.getElementById('submit-guess').addEventListener('click', () => {
    // 用占位符填充空槽位
    const guess = slots.map(s => s !== null ? s : '❓');
    document.dispatchEvent(new CustomEvent('sm:submit-guess', {
      detail: { guess },
      bubbles: true,
    }));
  });

  // 返回设置
  document.getElementById('back-to-panel').addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('sm:reset-game', { bubbles: true }));
  });
}

export function updateFeedback(exact, misplaced, mode) {
  renderFeedback(exact, misplaced, mode);
}

export function updateHistory(entries, mode) {
  renderHistory(entries, mode);
}

export function updateRounds(currentRound, maxRounds) {
  const infoEl = document.getElementById('rounds-info');
  if (!infoEl) return;
  if (maxRounds === null) {
    infoEl.classList.add('hidden');
  } else {
    infoEl.classList.remove('hidden');
    const roundsLeft = maxRounds - currentRound;
    infoEl.innerHTML = `<span>已尝试 ${currentRound} 次</span> | <span>剩余 ${roundsLeft} 次提交</span>`;
  }
}
