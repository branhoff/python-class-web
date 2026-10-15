export type RunMode =
  | { kind: 'production'; projectId: string }
  | { kind: 'emulator' }
  | { kind: 'dev-user'; user: string };

export function resolveRunMode(env: Record<string, string | undefined>): RunMode {
  const projectId = env['GCP_PROJECT'];
  const emulator = env['AUTH_EMULATOR'] === '1';
  if (projectId && emulator) {
    throw new Error(
      'AUTH_EMULATOR is for local development only. Unset it when GCP_PROJECT is set.',
    );
  }
  if (projectId) return { kind: 'production', projectId };
  if (emulator) return { kind: 'emulator' };
  const user = env['DEV_AUTH_USER'];
  if (user) return { kind: 'dev-user', user };
  throw new Error(
    'Set GCP_PROJECT (deployed), AUTH_EMULATOR=1 (local, with a fake sign-in), or DEV_AUTH_USER (local, no sign-in).',
  );
}
