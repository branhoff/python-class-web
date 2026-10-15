/* Browser-only: renders the /account page. Signed out, it shows sign-in,
   create-account and password-reset forms; signed in, the email, a sign-out
   button and the learner's progress. The decisions live in account-logic.js and
   the error wording in auth.js, both unit-tested. Not imported by the TS graph. */

import { accountView, checkForm, progressRows, safeNext } from './account-logic.js';
import { authHeader, ready, repaint } from './app-shell.js';
import { describeAuthError } from './auth.js';

const root = document.getElementById('account');

function el(tag, attributes = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  node.append(...children);
  return node;
}

function panel(...children) {
  return el('section', { class: 'panel' }, ...children);
}

function field(label, name, type, autocomplete) {
  const input = el('input', { name, type, autocomplete, required: '' });
  return el('label', { class: 'field' }, label, input);
}

async function fetchCompleted() {
  try {
    const res = await fetch('/progress/summary', { headers: await authHeader() });
    if (!res.ok) return null;
    return new Set((await res.json()).completedCells ?? []);
  } catch {
    return null;
  }
}

async function progressSection() {
  const courses = JSON.parse(document.getElementById('account-data').textContent).courses;
  const completed = await fetchCompleted();
  const list = el('ul', { class: 'account-courses' });
  for (const row of progressRows(courses, completed ?? new Set())) {
    const bar = el('div', { class: 'bar' }, el('span', { style: `width: ${row.pct}%` }));
    list.append(
      el(
        'li',
        {},
        el('strong', {}, row.title),
        bar,
        el('div', { class: 'count' }, `${row.done} of ${row.total} done`),
      ),
    );
  }
  return el('div', {}, el('h2', {}, 'Your progress'), list);
}

function authForm(auth) {
  let mode = 'signIn';
  const error = el('p', { class: 'error', role: 'alert' });
  const notice = el('p', { class: 'notice' });
  const email = field('Email', 'email', 'email', 'username');
  const password = field('Password', 'password', 'password', 'current-password');
  const submit = el('button', { class: 'btn', type: 'submit' });
  const forgot = el('button', { class: 'link', type: 'button' }, 'Forgot your password?');
  const tabs = ['signIn', 'signUp'].map((tab) => {
    const label = tab === 'signIn' ? 'Sign in' : 'Create account';
    return { tab, button: el('button', { class: 'tab', type: 'button', role: 'tab' }, label) };
  });
  const actions = el('div', { class: 'actions' }, submit, forgot);
  const form = el('form', { novalidate: '' }, email, password, error, notice, actions);

  function show(next) {
    mode = next;
    for (const { tab, button } of tabs) {
      button.setAttribute('aria-selected', String(tab === mode));
    }
    password.hidden = mode === 'reset';
    password.querySelector('input').autocomplete =
      mode === 'signUp' ? 'new-password' : 'current-password';
    submit.textContent = { signIn: 'Sign in', signUp: 'Create account', reset: 'Send reset link' }[
      mode
    ];
    forgot.hidden = mode === 'reset';
    error.textContent = '';
    notice.textContent = '';
  }

  for (const { tab, button } of tabs) button.addEventListener('click', () => show(tab));
  forgot.addEventListener('click', () => show('reset'));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = { mode, email: form.email.value.trim(), password: form.password.value };
    error.textContent = checkForm(values) ?? '';
    if (error.textContent) return;
    submit.disabled = true;
    try {
      if (mode === 'reset') {
        await auth.resetPassword(values.email);
        notice.textContent = 'If an account exists for that email, a reset link is on its way.';
      } else {
        await auth[mode](values.email, values.password);
        location.assign(safeNext(new URLSearchParams(location.search).get('next')));
        return;
      }
    } catch (failure) {
      error.textContent = describeAuthError(failure);
    }
    submit.disabled = false;
  });

  show('signIn');
  return panel(el('div', { class: 'tabs', role: 'tablist' }, ...tabs.map((t) => t.button)), form);
}

async function render({ auth, config }) {
  const view = accountView({ config, user: auth ? auth.currentUser() : null });
  root.replaceChildren();
  if (view === 'unavailable') {
    root.append(panel(el('p', {}, 'Sign-in is not set up on this server yet.')));
  } else if (view === 'sign-in') {
    root.append(authForm(auth));
  } else {
    const heading =
      view === 'dev'
        ? [
            el('p', {}, `You are using the local development account "${config.devUser}".`),
            el(
              'p',
              {},
              'Sign-in is switched off in this mode. Run "make dev-auth" to try the real sign-in.',
            ),
          ]
        : [el('p', {}, 'Signed in as ', el('strong', {}, auth.currentUser()))];
    const signOut = el('button', { class: 'btn', type: 'button' }, 'Sign out');
    signOut.addEventListener('click', () => {
      auth.signOut();
      repaint();
      render({ auth, config });
    });
    root.append(panel(...heading, view === 'dev' ? '' : signOut), await progressSection());
  }
}

ready.then(render);
