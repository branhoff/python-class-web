import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { createRemoteJWKSet } from 'jose';
import { createApp } from './app.ts';
import { createDevIdentity } from './dev-identity.ts';
import type { Authenticator } from './auth.ts';
import { createIdentityPlatformAuthenticator } from './identity-platform.ts';
import { createLessonSite, type AuthConfig } from './lessons/site.ts';
import { createFirestoreProgressRepository } from './repository/firestore.ts';
import { MemoryProgressRepository } from './repository/memory.ts';
import { resolveRunMode } from './run-mode.ts';
import type { ProgressRepository } from './repository/repository.ts';

const SECURETOKEN_JWKS_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

const port = Number(process.env['PORT'] ?? 8080);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid PORT: ${process.env['PORT']}`);
}

const DEV_PROJECT_ID = 'dev-project';

interface Wiring {
  repository: ProgressRepository;
  authenticate: Authenticator;
  authConfig: AuthConfig | null;
  devIdentity?: Hono;
}

async function wire(): Promise<Wiring> {
  const mode = resolveRunMode(process.env);
  if (mode.kind === 'production') {
    const apiKey = process.env['IDENTITY_PLATFORM_API_KEY'];
    return {
      repository: createFirestoreProgressRepository(mode.projectId),
      authenticate: createIdentityPlatformAuthenticator(
        mode.projectId,
        createRemoteJWKSet(new URL(SECURETOKEN_JWKS_URL)),
      ),
      authConfig: apiKey ? { apiKey, projectId: mode.projectId } : null,
    };
  }
  if (mode.kind === 'emulator') {
    const identity = await createDevIdentity({
      projectId: DEV_PROJECT_ID,
      onPasswordReset: (email) =>
        console.log(
          `[dev-identity] password reset requested for ${email}; no email is sent locally`,
        ),
    });
    return {
      repository: new MemoryProgressRepository(),
      authenticate: createIdentityPlatformAuthenticator(DEV_PROJECT_ID, identity.keys),
      authConfig: {
        apiKey: 'dev-key',
        projectId: DEV_PROJECT_ID,
        identityUrl: '/dev-identity/v1',
        tokenUrl: '/dev-identity/securetoken/v1',
      },
      devIdentity: identity.app,
    };
  }
  return {
    repository: new MemoryProgressRepository(),
    authenticate: async () => mode.user,
    authConfig: { devUser: mode.user },
  };
}

const { devIdentity, authConfig, ...deps } = await wire();

const root = new Hono();
root.route('/', createApp(deps));
if (devIdentity) root.route('/dev-identity', devIdentity);
root.route('/', createLessonSite('content', authConfig));
root.use('/pyodide/*', serveStatic({ root: process.env['PYODIDE_ROOT'] ?? './vendor' }));

serve({ fetch: root.fetch, port });
console.log(`listening on :${port}`);
