/* Browser auth shell: fetches the public config, keeps the top-right account
   button up to date, and exposes authHeader() so the runner can authenticate
   progress calls. Sign-in itself lives on the /account page. In local
   development with a fixed user there is no sign-in; the config carries that
   user's name instead. Not imported by the TS graph. */

import { accountLink } from './account-logic.js';
import { createAuth } from './auth.js';

let auth = null;
let config = {};

export function repaint() {
  const link = document.getElementById('account-link');
  if (!link) return;
  const state = accountLink({
    user: auth ? auth.currentUser() : null,
    devUser: config.devUser,
    path: location.pathname,
  });
  link.textContent = state.label;
  link.href = state.href;
  link.classList.toggle('signed-in', state.signedIn);
  link.hidden = state.hidden;
}

async function boot() {
  try {
    config = await (await fetch('/auth/config')).json();
  } catch {
    // unconfigured or offline: the button stays a plain "Sign in" link
  }
  if (config.apiKey) {
    auth = createAuth({
      apiKey: config.apiKey,
      fetch,
      storage: localStorage,
      identityUrl: config.identityUrl,
      tokenUrl: config.tokenUrl,
    });
  }
  repaint();
  return { auth, config };
}

export const ready = typeof document === 'undefined' ? Promise.resolve({ auth, config }) : boot();

export async function authHeader() {
  const token = auth ? await auth.getToken() : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
