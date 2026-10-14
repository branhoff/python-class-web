/* Browser auth shell: fetches the public config, renders a sign-in header, and
   exposes authHeader() so the runner can authenticate progress calls. When the
   app is unconfigured (dev), there is no config and no sign-in UI — the server
   bypasses auth there. Not imported by the TS graph. */

import { createAuth } from './auth.js';

let auth = null;

function render() {
  const header = document.getElementById('auth');
  if (!header || !auth) return;
  const user = auth.currentUser();
  if (user) {
    header.innerHTML =
      '<span class="who"></span> <button id="signout" type="button">Sign out</button>';
    header.querySelector('.who').textContent = `Signed in as ${user}`;
    document.getElementById('signout').addEventListener('click', () => {
      auth.signOut();
      render();
    });
    return;
  }
  header.innerHTML =
    '<form id="signin">' +
    '<input name="email" type="email" placeholder="email" required> ' +
    '<input name="password" type="password" placeholder="password" required> ' +
    '<button type="submit">Sign in</button> ' +
    '<button type="button" id="create">Create account</button> ' +
    '<span class="err"></span></form>';
  const form = document.getElementById('signin');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    authenticate(form, 'signIn');
  });
  document.getElementById('create').addEventListener('click', () => authenticate(form, 'signUp'));
}

async function authenticate(form, method) {
  try {
    await auth[method](form.email.value, form.password.value);
    location.reload();
  } catch (error) {
    form.querySelector('.err').textContent = String(error.message ?? error);
  }
}

async function boot() {
  let config = {};
  try {
    config = await (await fetch('/auth/config')).json();
  } catch {
    // unconfigured or offline: leave the header empty, no sign-in
  }
  if (!config.apiKey) return;
  auth = createAuth({ apiKey: config.apiKey, fetch, storage: localStorage });
  render();
}

export async function authHeader() {
  const token = auth ? await auth.getToken() : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

if (typeof document !== 'undefined') boot();
