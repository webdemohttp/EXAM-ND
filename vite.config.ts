import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages'de her türlü yolda çalışması için base'i './' yapıyoruz.
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Bazı tarayıcıların modül scriptlerini yanlış yorumlamasını önlemek için:
    modulePreload: {
      polyfill: true
    }
  }
});
