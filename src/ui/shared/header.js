/**
 * 渲染页头 HTML
 * @returns {string} header HTML 字符串
 */
export function renderHeader() {
  return `
    <div class="container mx-auto px-4 flex items-center justify-between">
      <h1 class="text-xl font-bold">Sequence Master</h1>
      <div class="flex gap-2">
        <button id="tab-basic" class="tab-btn px-4 py-1 rounded bg-blue-600 text-white">基础模式</button>
        <button id="tab-advanced" class="tab-btn px-4 py-1 rounded bg-slate-600 hover:bg-slate-500">进阶模式</button>
        <button id="btn-download" class="px-4 py-1 rounded bg-slate-700 text-slate-400 cursor-not-allowed" disabled title="Windows / Android 安装包即将上线">下载 · 即将上线</button>
      </div>
    </div>
  `;
}
