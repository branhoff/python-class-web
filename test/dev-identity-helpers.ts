import assert from 'node:assert/strict';
import { createDevIdentity } from '../src/dev-identity.ts';

export const PROJECT = 'dev-project';
export const CLOCK = Date.UTC(2026, 0, 1);

export async function setup(now = () => CLOCK) {
  const resets: string[] = [];
  const identity = await createDevIdentity({
    projectId: PROJECT,
    now,
    onPasswordReset: (email) => resets.push(email),
  });
  const post = (path: string, body: unknown) =>
    identity.app.request(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  return { identity, post, resets };
}

export async function errorOf(res: Response): Promise<string> {
  assert.equal(res.status, 400);
  return ((await res.json()) as { error: { message: string } }).error.message;
}
