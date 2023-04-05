import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

const root = path.resolve(__dirname, 'src');
const pagesDir = path.resolve(root, 'pages');
const componentsDir = path.resolve(root, 'components');
const outDir = path.resolve(__dirname, 'dist');
const publicDir = path.resolve(__dirname, 'public');
const isDev = process.env.__DEV__ === 'true';
const isProduction = !isDev;
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': root,
      '@c': componentsDir,
    },
  },
  publicDir,
  build: {
    outDir,
    minify: isProduction,
    reportCompressedSize: isProduction,
    rollupOptions: {
      watch: {
        include: ['src/**', 'vite.config.ts'],
        exclude: ['node_modules/**'],
      },
      input: {
        options: path.resolve(pagesDir, 'options', 'index.html'),
        popup: path.resolve(pagesDir, 'popup', 'index.html'),
        background: path.resolve(pagesDir, 'background', 'index.ts'),
        content: path.resolve(pagesDir, 'content', 'index.ts'),
      },
      output: {
        entryFileNames: 'src/pages/[name]/index.js',
        chunkFileNames: isDev ? 'assets/[name].js' : 'assets/[name].[hash].js',
      },
    },
  },
});
