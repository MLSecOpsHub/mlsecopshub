import { SITE } from '../config/site';

export const ORG_ID = `${SITE.url}/#organization`;
export const PERSON_ID = `${SITE.url}/#founder`;
export const WEBSITE_ID = `${SITE.url}/#website`;

export type Graph = Record<string, unknown>;

export function organization(): Graph {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE.url,
    logo: { '@type': 'ImageObject', url: `${SITE.url}/logo.png`, width: 512, height: 512 },
    description: SITE.description,
    founder: { '@id': PERSON_ID },
    sameAs: [SITE.social.githubOrg, SITE.social.substack, SITE.social.x, SITE.social.instagram, SITE.social.awesome].filter(Boolean),
    knowsAbout: [
      'MLSecOps',
      'AI security',
      'prompt injection',
      'model supply chain security',
      'EU AI Act',
      'agentic AI security',
      'Model Context Protocol security',
    ],
    contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: SITE.contactEmail, url: `${SITE.url}/contact`, availableLanguage: 'en' },
  };
}

export function person(extra: Graph = {}): Graph {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE.founder.name,
    jobTitle: 'Security Engineer',
    url: `${SITE.url}/about`,
    worksFor: { '@id': ORG_ID },
    sameAs: [SITE.social.x, SITE.social.substack, SITE.github.listUrl, SITE.social.instagram, SITE.social.linkedin].filter(Boolean),
    knowsAbout: ['MLSecOps', 'AI security', 'application security', 'model supply chain security', 'prompt injection'],
    ...extra,
  };
}

export function website(): Graph {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE.name,
    url: SITE.url,
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
  };
}

export function webPage(path: string, title: string, description: string, type = 'WebPage'): Graph {
  return {
    '@type': type,
    '@id': `${SITE.url}${path}#webpage`,
    url: `${SITE.url}${path}`,
    name: title,
    description,
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE.url}/og${path === '/' ? '/home' : path}.png`, width: 1200, height: 630 },
  };
}

export function breadcrumbs(items: { name: string; path: string }[]): Graph {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
}

export function faqPage(faq: { q: string; a: string }[], path: string): Graph {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE.url}${path}#faq`,
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') },
    })),
  };
}

export function service(opts: { path: string; name: string; description: string; serviceType: string }): Graph {
  return {
    '@type': 'Service',
    '@id': `${SITE.url}${opts.path}#service`,
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Place', name: 'Worldwide' },
    availableChannel: { '@type': 'ServiceChannel', serviceUrl: SITE.bookingUrl, availableLanguage: 'en' },
    url: `${SITE.url}${opts.path}`,
  };
}

export function article(opts: {
  path: string;
  headline: string;
  description: string;
  published: Date;
  updated: Date;
  type?: 'Article' | 'TechArticle' | 'BlogPosting';
  keywords?: string[];
}): Graph {
  return {
    '@type': opts.type ?? 'Article',
    '@id': `${SITE.url}${opts.path}#article`,
    headline: opts.headline,
    description: opts.description,
    datePublished: opts.published.toISOString(),
    dateModified: opts.updated.toISOString(),
    author: { '@id': PERSON_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@id': `${SITE.url}${opts.path}#webpage` },
    image: `${SITE.url}/og${opts.path}.png`,
    inLanguage: 'en',
    keywords: opts.keywords,
  };
}
