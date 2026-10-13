import { serve } from '@hono/node-server';
import { createRemoteJWKSet } from 'jose';
import { createApp } from './app.ts';
import type { Authenticator } from './auth.ts';
import { createIdentityPlatformAuthenticator } from './identity-platform.ts';
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

serve({ fetch: createApp(wire()).fetch, port });
console.log(`listening on :${port}`);
