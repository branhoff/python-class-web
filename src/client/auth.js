/* Identity Platform email/password auth over its REST API, no SDK dependency.
   Pure w.r.t. injected deps (fetch, storage, now) so it is unit-tested in Node;
   the browser wires real fetch + localStorage. */

const IDENTITY = 'https://identitytoolkit.googleapis.com/v1';
const SECURETOKEN = 'https://securetoken.googleapis.com/v1';
const REFRESH_SKEW_MS = 60_000;
const KEY = 'pcw.auth';

function readSession(storage) {
  try {
    const raw = storage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const MESSAGES = {
  EMAIL_EXISTS: 'An account with that email already exists. Try signing in instead.',
  INVALID_LOGIN_CREDENTIALS: 'That email and password do not match an account.',
  INVALID_PASSWORD: 'That email and password do not match an account.',
  EMAIL_NOT_FOUND: 'That email and password do not match an account.',
  INVALID_EMAIL: 'That does not look like an email address.',
  MISSING_PASSWORD: 'Enter a password.',
  TOO_MANY_ATTEMPTS_TRY_LATER: 'Too many attempts. Wait a few minutes and try again.',
  USER_DISABLED: 'This account has been disabled.',
};

export function describeAuthError(error) {
  const code = String(error?.message ?? error)
    .split(' : ')[0]
    .trim();
  if (code === 'WEAK_PASSWORD') return 'Choose a password with at least 6 characters.';
  return MESSAGES[code] ?? 'Something went wrong. Please try again.';
}

export function createAuth({
  apiKey,
  fetch,
  storage,
  now = () => Date.now(),
  identityUrl = IDENTITY,
  tokenUrl = SECURETOKEN,
}) {
  let session = readSession(storage);

  function persist() {
    if (session) storage.setItem(KEY, JSON.stringify(session));
    else storage.removeItem(KEY);
  }

  // signUp and signInWithPassword share request + response shape; only the
  // Identity Platform endpoint differs.
  async function passwordAuth(endpoint, email, password) {
    const res = await fetch(`${identityUrl}/accounts:${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message ?? 'AUTH_FAILED');
    session = {
      email: data.email,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresAt: now() + Number(data.expiresIn) * 1000,
    };
    persist();
    return session.email;
  }

  function signIn(email, password) {
    return passwordAuth('signInWithPassword', email, password);
  }

  function signUp(email, password) {
    return passwordAuth('signUp', email, password);
  }

  async function resetPassword(email) {
    const res = await fetch(`${identityUrl}/accounts:sendOobCode?key=${apiKey}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ requestType: 'PASSWORD_RESET', email }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error?.message ?? 'AUTH_FAILED');
    }
  }

  async function getToken() {
    if (!session) return null;
    if (now() < session.expiresAt - REFRESH_SKEW_MS) return session.idToken;
    const res = await fetch(`${tokenUrl}/token?key=${apiKey}`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(session.refreshToken)}`,
    });
    if (!res.ok) {
      signOut();
      return null;
    }
    const data = await res.json();
    session = {
      ...session,
      idToken: data.id_token,
      refreshToken: data.refresh_token,
      expiresAt: now() + Number(data.expires_in) * 1000,
    };
    persist();
    return session.idToken;
  }

  function signOut() {
    session = null;
    persist();
  }

  function currentUser() {
    return session ? session.email : null;
  }

  return { signIn, signUp, resetPassword, getToken, signOut, currentUser };
}
