
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages'de hem ana domainde hem de alt klasörde çalışması için
  base: '', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
