import { defineConfig } from 'vite';

// Tauri 打包走 tauri://localhost 根路径，资源必须相对引用；
// GitHub Pages 带 /Sequence-Master/ 子路径，必须绝对引用。两者靠此开关区分。
const isTauri = !!process.env.TAURI_ENV_PLATFORM;

export default defineConfig({
  base: isTauri ? './' : '/Sequence-Master/',
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        download: 'download.html',
      },
    },
  },
});
