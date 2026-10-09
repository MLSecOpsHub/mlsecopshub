// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { lastmodFor } from './src/lib/routes-lastmod.mjs';
import { HOLDING_PAGE, isHoldingRoute } from './src/config/holding.mjs';

export default defineConfig({
  site: 'https://mlsecopshub.com',
  output: 'static',
  trailingSlash: 'never',
  compressHTML: true,
  build: { inlineStylesheets: 'always', format: 'directory' },
  prefetch: false,
  integrations: [
    sitemap({
      filenameBase: 'sitemap',
      filter: (page) =>
        !page.includes('/og/') &&
        !page.includes('/contact/thanks') &&
        (!HOLDING_PAGE || (isHoldingRoute(new URL(page).pathname) && !page.endsWith('/404'))),
      serialize: (item) => {
        const lastmod = lastmodFor(item.url);
        return lastmod ? { ...item, lastmod: lastmod.toISOString() } : item;
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
