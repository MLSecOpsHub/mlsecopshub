import type { APIRoute, GetStaticPaths } from 'astro';
import { allRoutes } from '../../lib/routes';
import { renderOg } from '../../lib/og';

export const getStaticPaths = (async () => {
  const routes = await allRoutes();
  return routes.map((r) => ({ params: { slug: r.path === '/' ? 'home' : r.path.slice(1) }, props: { ...r } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg({ title: props.title, kicker: props.kicker, subtitle: props.subtitle });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' } });
};
