import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://davemoudy.github.io',
  base: '/CircleCityDance/',
  trailingSlash: 'ignore',
  vite: {
    plugins: [tailwindcss()],
  },
});
