/* Identity Platform email/password auth over its REST API — no SDK dependency.
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

export function createAuth({ apiKey, fetch, storage, now = () => Date.now() }) {
  let session = readSession(storage);

  function persist() {
    if (session) storage.setItem(KEY, JSON.stringify(session));
    else storage.removeItem(KEY);
  }

  async function signIn(email, password) {
    const res = await fetch(`${IDENTITY}/accounts:signInWithPassword?key=${apiKey}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message ?? 'SIGN_IN_FAILED');
    session = {
      email: data.email,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresAt: now() + Number(data.expiresIn) * 1000,
    };
    persist();
    return session.email;
  }

  async function getToken() {
    if (!session) return null;
    if (now() < session.expiresAt - REFRESH_SKEW_MS) return session.idToken;
    const res = await fetch(`${SECURETOKEN}/token?key=${apiKey}`, {
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

  return { signIn, getToken, signOut, currentUser };
}
