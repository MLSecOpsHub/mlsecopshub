import { defineMiddleware } from 'astro:middleware';
import { HOLDING_PAGE, isHoldingRoute } from './config/holding.mjs';

/**
 * Holding mode (see src/config/holding.mjs): every route outside the allowlist
 * gets an empty 404 response. During `astro build` that makes Astro skip the
 * page instead of writing it to dist/, and in `astro dev` it shows the 404 page.
 */
export const onRequest = defineMiddleware((context, next) => {
  if (HOLDING_PAGE && !isHoldingRoute(context.url.pathname)) {
    return new Response(null, { status: 404 });
  }
  return next();
});
