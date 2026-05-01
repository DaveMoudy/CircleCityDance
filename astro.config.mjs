import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Set GH Pages base/site once we know the repo name; defaults work for user/org pages or local preview.
export default defineConfig({
  site: 'https://circlecitydance.example',
  vite: {
    plugins: [tailwindcss()],
  },
});
