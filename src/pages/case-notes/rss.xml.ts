import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCaseNotes } from '../../lib/content';
import { SITE } from '../../config/site';

export async function GET(context: APIContext) {
  const notes = await getCaseNotes();
  return rss({
    title: `${SITE.name} case notes`,
    description: 'Anonymized, illustrative write-ups of MLSecOps and AI security engagements: context, finding, fix, outcome.',
    site: context.site!,
    trailingSlash: false,
    items: notes.map((n) => ({
      title: n.data.title,
      description: n.data.description,
      pubDate: n.data.published,
      link: `/case-notes/${n.id}`,
      categories: [n.data.lane],
    })),
    customData: '<language>en</language>',
  });
}
