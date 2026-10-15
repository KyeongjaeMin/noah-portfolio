import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' → 결과물을 어떤 주소(도메인 루트, 하위 폴더, 미리보기 서버)에 올려도 그대로 동작하게 함
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    sourcemap: false,
  },
});
