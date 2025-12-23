
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages genellikle 'kullaniciadi.github.io/repo-adi/' şeklinde olduğu için
// base kısmına depo adını otomatik olarak alacak bir mantık kuruyoruz.
export default defineConfig({
  plugins: [react()],
  base: './', // Göreceli yollar kullanarak her türlü klasör yapısında çalışmasını sağlar
});
