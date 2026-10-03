/**
 * 下载落地页渲染（download.html 专用，与游戏页零耦合）
 */
const REPO = 'https://github.com/Jason-Frog/Sequence-Master';
const VERSION = '1.0.0';
const MSI_URL = `${REPO}/releases/latest/download/Sequence.Master_${VERSION}_x64_en-US.msi`;
const EXE_URL = `${REPO}/releases/latest/download/Sequence.Master_${VERSION}_x64-setup.exe`;

function card(inner) {
  return `<div class="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center gap-3">${inner}</div>`;
}

export function renderDownloadPage() {
  return `
    <div class="flex flex-col items-center text-center gap-4 mb-12">
      <a href="./" class="text-slate-400 hover:text-white text-sm mb-2">&larr; 返回游戏</a>
      <img src="./app-icon.png" alt="Sequence Master 图标" class="w-24 h-24 rounded-2xl shadow-2xl">
      <h1 class="text-4xl font-bold">下载 Sequence Master</h1>
      <p class="text-slate-300 max-w-xl">序列逻辑推理游戏，双模式解谜，离线可玩。免费、无广告、无需注册。</p>
      <div class="flex gap-2 items-center text-sm">
        <span class="bg-blue-600/30 text-blue-300 border border-blue-500/40 px-3 py-1 rounded-full">v${VERSION}</span>
        <a href="${REPO}/releases" class="text-slate-400 hover:text-white underline">更新日志</a>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      ${card(`
        <div class="text-4xl">&#128421;</div>
        <h2 class="text-xl font-semibold">Windows</h2>
        <p class="text-sm text-slate-400">Windows 10 / 11 · 64 位</p>
        <a href="${MSI_URL}" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg">下载 MSI 安装包</a>
        <a href="${EXE_URL}" class="w-full border border-white/20 hover:bg-white/10 px-4 py-2 rounded-lg">下载 EXE 安装向导</a>
      `)}
      ${card(`
        <div class="text-4xl">&#129302;</div>
        <h2 class="text-xl font-semibold">Android</h2>
        <p class="text-sm text-slate-400">APK 安装包 · 触屏优化</p>
        <span class="w-full bg-slate-700 text-slate-400 px-4 py-2 rounded-lg cursor-not-allowed">即将上线</span>
      `)}
      ${card(`
        <div class="text-4xl">&#127760;</div>
        <h2 class="text-xl font-semibold">网页版</h2>
        <p class="text-sm text-slate-400">功能完全一致 · 无需下载</p>
        <a href="./" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg">在线直接玩</a>
      `)}
    </div>

    <p class="text-center text-slate-500 text-sm mt-12">
      问题反馈：<a href="${REPO}/issues" class="text-slate-400 hover:text-white underline">GitHub Issues</a>
    </p>
  `;
}

document.getElementById('download-page').innerHTML = renderDownloadPage();
