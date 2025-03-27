import { defineConfig } from 'astro/config';
import { fileURLToPath, URL } from 'url';
import tailwind from '@astrojs/tailwind';

import vue from '@astrojs/vue';

export default defineConfig({
  integrations: [vue({ jsx: true, devtools: true }), tailwind({ applyBaseStyles: false})],

  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
  }
});