/**
 * 渲染页头 HTML
 * @returns {string} header HTML 字符串
 */
export function renderHeader() {
  const isClient = typeof window.__TAURI_INTERNALS__ !== 'undefined';
  return `
    <div class="container mx-auto px-3 sm:px-4 flex items-center justify-between flex-wrap gap-y-2">
      <h1 class="text-lg sm:text-xl font-bold whitespace-nowrap">Sequence Master</h1>
      <div class="flex gap-1 sm:gap-2">
        <button id="tab-basic" class="tab-btn px-3 py-1.5 sm:px-4 sm:py-1 rounded bg-blue-600 text-white text-sm sm:text-base whitespace-nowrap">基础模式</button>
        <button id="tab-advanced" class="tab-btn px-3 py-1.5 sm:px-4 sm:py-1 rounded bg-slate-600 hover:bg-slate-500 text-sm sm:text-base whitespace-nowrap">进阶模式</button>
        ${isClient ? '' : '<a id="btn-download" href="download.html" class="px-3 py-1.5 sm:px-4 sm:py-1 rounded bg-slate-600 hover:bg-slate-500 text-white text-sm sm:text-base whitespace-nowrap">下载</a>'}
      </div>
    </div>
  `;
}
