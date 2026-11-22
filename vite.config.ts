import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // Support floor: Safari 16.4 (the last iOS on iPhone 8 and X), Chrome and Edge 111, Firefox 114.
  // Lightning CSS lowers newer CSS (light-dark(), nesting) for these when it minifies.
  build: { target: ['safari16.4', 'chrome111', 'edge111', 'firefox114'] },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
