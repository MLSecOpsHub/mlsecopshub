import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../../lib/content';
import { SITE } from '../../config/site';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: `${SITE.name} blog`,
    description: 'Announcements and data releases from MLSecOpsHub.',
    site: context.site!,
    trailingSlash: false,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.published,
      link: p.data.canonical ?? `/blog/${p.id}`,
      categories: p.data.tags,
    })),
    customData: '<language>en</language>',
  });
}
