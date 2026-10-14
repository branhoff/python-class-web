import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { createRemoteJWKSet } from 'jose';
import { createApp } from './app.ts';
import type { Authenticator } from './auth.ts';
import { createIdentityPlatformAuthenticator } from './identity-platform.ts';
import { createLessonSite } from './lessons/site.ts';
import { createFirestoreProgressRepository } from './repository/firestore.ts';
import { MemoryProgressRepository } from './repository/memory.ts';
import type { ProgressRepository } from './repository/repository.ts';

const SECURETOKEN_JWKS_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

const port = Number(process.env['PORT'] ?? 8080);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid PORT: ${process.env['PORT']}`);
}

function wire(): { repository: ProgressRepository; authenticate: Authenticator } {
  const projectId = process.env['GCP_PROJECT'];
  if (projectId) {
    return {
      repository: createFirestoreProgressRepository(projectId),
      authenticate: createIdentityPlatformAuthenticator(
        projectId,
        createRemoteJWKSet(new URL(SECURETOKEN_JWKS_URL)),
      ),
    };
  }
  const devUser = process.env['DEV_AUTH_USER'];
  if (!devUser) {
    throw new Error(
      'Set GCP_PROJECT (deployed) or DEV_AUTH_USER (local, in-memory, no real auth).',
    );
  }
  return { repository: new MemoryProgressRepository(), authenticate: async () => devUser };
}

const idpApiKey = process.env['IDENTITY_PLATFORM_API_KEY'];
const gcpProject = process.env['GCP_PROJECT'];
const authConfig = idpApiKey && gcpProject ? { apiKey: idpApiKey, projectId: gcpProject } : null;

const root = new Hono();
root.route('/', createApp(wire()));
root.route('/', createLessonSite('content', authConfig));
root.use('/pyodide/*', serveStatic({ root: process.env['PYODIDE_ROOT'] ?? './vendor' }));

serve({ fetch: root.fetch, port });
console.log(`listening on :${port}`);
