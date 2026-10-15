import { randomUUID } from 'node:crypto';
import { Hono, type Context } from 'hono';
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT, type JWTVerifyGetKey } from 'jose';

const TOKEN_LIFETIME_SECONDS = 3600;
const MIN_PASSWORD_LENGTH = 6;
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const KEY_ID = 'dev-key';

interface DevUser {
  uid: string;
  email: string;
  password: string;
}

export interface DevIdentityOptions {
  projectId: string;
  onPasswordReset?: (email: string) => void;
  now?: () => number;
}

export interface DevIdentity {
  app: Hono;
  keys: JWTVerifyGetKey;
}

function failure(c: Context, message: string) {
  return c.json({ error: { code: 400, message } }, 400);
}

async function readCredentials(c: Context): Promise<{ email: string; password: string }> {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = typeof body['email'] === 'string' ? body['email'].trim().toLowerCase() : '';
  const password = typeof body['password'] === 'string' ? body['password'] : '';
  return { email, password };
}

export async function createDevIdentity({
  projectId,
  onPasswordReset = () => {},
  now = Date.now,
}: DevIdentityOptions): Promise<DevIdentity> {
  const { publicKey, privateKey } = await generateKeyPair('RS256');
  const jwk = { ...(await exportJWK(publicKey)), kid: KEY_ID, alg: 'RS256', use: 'sig' };
  const usersByEmail = new Map<string, DevUser>();
  const usersByRefreshToken = new Map<string, DevUser>();

  async function startSession(user: DevUser) {
    const issuedAt = Math.floor(now() / 1000);
    const idToken = await new SignJWT({ email: user.email })
      .setProtectedHeader({ alg: 'RS256', kid: KEY_ID })
      .setIssuer(`https://securetoken.google.com/${projectId}`)
      .setAudience(projectId)
      .setSubject(user.uid)
      .setIssuedAt(issuedAt)
      .setExpirationTime(issuedAt + TOKEN_LIFETIME_SECONDS)
      .sign(privateKey);
    const refreshToken = randomUUID();
    usersByRefreshToken.set(refreshToken, user);
    return { idToken, refreshToken };
  }

  const app = new Hono();

  app.post('/v1/accounts:signUp', async (c) => {
    const { email, password } = await readCredentials(c);
    if (!EMAIL_PATTERN.test(email)) return failure(c, 'INVALID_EMAIL');
    if (password === '') return failure(c, 'MISSING_PASSWORD');
    if (password.length < MIN_PASSWORD_LENGTH) {
      return failure(
        c,
        `WEAK_PASSWORD : Password should be at least ${MIN_PASSWORD_LENGTH} characters`,
      );
    }
    if (usersByEmail.has(email)) return failure(c, 'EMAIL_EXISTS');
    const user = { uid: randomUUID(), email, password };
    usersByEmail.set(email, user);
    return c.json({
      email,
      localId: user.uid,
      expiresIn: String(TOKEN_LIFETIME_SECONDS),
      ...(await startSession(user)),
    });
  });

  app.post('/v1/accounts:signInWithPassword', async (c) => {
    const { email, password } = await readCredentials(c);
    const user = usersByEmail.get(email);
    if (!user || user.password !== password) return failure(c, 'INVALID_LOGIN_CREDENTIALS');
    return c.json({
      email,
      localId: user.uid,
      expiresIn: String(TOKEN_LIFETIME_SECONDS),
      ...(await startSession(user)),
    });
  });

  app.post('/v1/accounts:sendOobCode', async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
    const email = typeof body['email'] === 'string' ? body['email'].trim().toLowerCase() : '';
    if (body['requestType'] !== 'PASSWORD_RESET') return failure(c, 'INVALID_REQ_TYPE');
    if (!EMAIL_PATTERN.test(email)) return failure(c, 'INVALID_EMAIL');
    if (usersByEmail.has(email)) onPasswordReset(email);
    return c.json({ email });
  });

  app.post('/securetoken/v1/token', async (c) => {
    const form = await c.req.parseBody();
    const user = usersByRefreshToken.get(String(form['refresh_token']));
    if (form['grant_type'] !== 'refresh_token' || !user) {
      return failure(c, 'INVALID_REFRESH_TOKEN');
    }
    usersByRefreshToken.delete(String(form['refresh_token']));
    const { idToken, refreshToken } = await startSession(user);
    return c.json({
      id_token: idToken,
      refresh_token: refreshToken,
      expires_in: String(TOKEN_LIFETIME_SECONDS),
      user_id: user.uid,
    });
  });

  return { app, keys: createLocalJWKSet({ keys: [jwk] }) };
}
