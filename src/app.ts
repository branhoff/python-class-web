import { Hono } from 'hono';
import type { Authenticator } from './auth.ts';
import { deriveProgress } from './progress.ts';
import type { ProgressEventKind, ProgressRepository } from './repository/repository.ts';

export interface AppDeps {
  repository: ProgressRepository;
  authenticate: Authenticator;
  now?: () => number;
}

type AppEnv = { Variables: { userId: string } };

const EVENT_KINDS: readonly string[] = ['attempt', 'completed'];

export function createApp({ repository, authenticate, now = Date.now }: AppDeps): Hono<AppEnv> {
  const app = new Hono<AppEnv>();

  app.get('/health', (c) => c.json({ status: 'ok' }));

  app.use('/progress/*', async (c, next) => {
    const userId = await authenticate(c.req.header('Authorization'));
    if (userId === null) {
      return c.json({ error: 'unauthorized' }, 401);
    }
    c.set('userId', userId);
    await next();
  });

  app.get('/progress/summary', async (c) => {
    const events = await repository.listEvents(c.get('userId'));
    return c.json(deriveProgress(events));
  });

  app.post('/progress/events', async (c) => {
    const body: unknown = await c.req.json().catch(() => null);
    const { cellId, kind } = (body ?? {}) as { cellId?: unknown; kind?: unknown };
    if (typeof cellId !== 'string' || cellId === '' || !EVENT_KINDS.includes(String(kind))) {
      return c.json({ error: 'cellId and kind (attempt|completed) are required' }, 400);
    }
    await repository.appendEvent(c.get('userId'), {
      cellId,
      kind: kind as ProgressEventKind,
      at: now(),
    });
    return c.json({ recorded: true }, 201);
  });

  return app;
}
