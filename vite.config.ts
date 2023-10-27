import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // (monacoEditorPlugin as any).default({
    //   languageWorkers: ['editorWorkerService', 'typescript'],
    //   globalAPI: true,
    // }),
  ],
  resolve: {
    alias: {
      '@/': `${resolve(__dirname, 'src')}/`,
      '@public/': `${resolve(__dirname, 'public')}/`,
    },
  },
});
