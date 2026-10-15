import type { MiddlewareHandler } from 'hono';

export const crossOriginIsolation: MiddlewareHandler = async (c, next) => {
  await next();
  c.header('Cross-Origin-Opener-Policy', 'same-origin');
  c.header('Cross-Origin-Embedder-Policy', 'require-corp');
};
