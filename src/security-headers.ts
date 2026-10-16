import type { MiddlewareHandler } from 'hono';

const SIGN_IN_ENDPOINTS = [
  'https://identitytoolkit.googleapis.com',
  'https://securetoken.googleapis.com',
];

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'wasm-unsafe-eval'",
  "worker-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self' ${SIGN_IN_ENDPOINTS.join(' ')}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

export function securityHeaders(enforce: boolean): MiddlewareHandler {
  const policyHeader = enforce ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only';
  return async (c, next) => {
    await next();
    c.header(policyHeader, CONTENT_SECURITY_POLICY);
    c.header('X-Content-Type-Options', 'nosniff');
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    c.header('X-Frame-Options', 'DENY');
  };
}
