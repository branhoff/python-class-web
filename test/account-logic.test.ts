import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  accountLink,
  accountView,
  checkForm,
  progressRows,
  safeNext,
} from '../src/client/account-logic.js';

test('signed out, the button says Sign in and remembers the page to come back to', () => {
  assert.deepEqual(accountLink({ user: null, devUser: undefined, path: '/lessons/loops' }), {
    label: 'Sign in',
    href: '/account?next=%2Flessons%2Floops',
    signedIn: false,
    hidden: false,
  });
});

test('on the account page itself the Sign in button has no next page and is hidden', () => {
  const link = accountLink({ user: null, devUser: undefined, path: '/account' });
  assert.equal(link.href, '/account');
  assert.equal(link.hidden, true);
});

test('once signed in, the account button stays visible on the account page', () => {
  assert.equal(accountLink({ user: 'a@b.co', devUser: undefined, path: '/account' }).hidden, false);
});

test('signed in, the button shows the email and opens the account page', () => {
  assert.deepEqual(accountLink({ user: 'ada@example.com', devUser: undefined, path: '/' }), {
    label: 'ada@example.com',
    href: '/account',
    signedIn: true,
    hidden: false,
  });
});

test('a local development user is shown as such', () => {
  assert.deepEqual(accountLink({ user: null, devUser: 'me', path: '/' }), {
    label: 'me (dev)',
    href: '/account',
    signedIn: true,
    hidden: false,
  });
});

test('a real signed-in user wins over a development user', () => {
  assert.equal(
    accountLink({ user: 'ada@example.com', devUser: 'me', path: '/' }).label,
    'ada@example.com',
  );
});

test('the account page shows the view that matches the server and the session', () => {
  assert.equal(accountView({ config: { devUser: 'me' }, user: null }), 'dev');
  assert.equal(accountView({ config: {}, user: null }), 'unavailable');
  assert.equal(accountView({ config: { apiKey: 'K' }, user: null }), 'sign-in');
  assert.equal(accountView({ config: { apiKey: 'K' }, user: 'a@b.co' }), 'signed-in');
});

test('only a path on this site is accepted as the page to return to', () => {
  assert.equal(safeNext('/lessons/loops'), '/lessons/loops');
  assert.equal(safeNext('/account?x=1'), '/account?x=1');
  assert.equal(safeNext(null), '/');
  assert.equal(safeNext(undefined), '/');
  assert.equal(safeNext(''), '/');
  assert.equal(safeNext('lessons/loops'), '/');
  assert.equal(safeNext('https://evil.example/'), '/');
  assert.equal(safeNext('//evil.example/'), '/');
  assert.equal(safeNext('/\\evil.example/'), '/');
});

test('the form needs an email, and a password except when resetting', () => {
  assert.equal(
    checkForm({ mode: 'signIn', email: 'nope', password: 'secret1' }),
    'Enter your email address.',
  );
  assert.equal(
    checkForm({ mode: 'signIn', email: 'a@b.co', password: '' }),
    'Enter your password.',
  );
  assert.equal(checkForm({ mode: 'signIn', email: 'a@b.co', password: 'x' }), null);
  assert.equal(checkForm({ mode: 'reset', email: 'a@b.co', password: '' }), null);
  assert.equal(
    checkForm({ mode: 'reset', email: 'nope', password: '' }),
    'Enter your email address.',
  );
});

test('a new password must have at least six characters, an existing one is not checked', () => {
  const short = checkForm({ mode: 'signUp', email: 'a@b.co', password: '12345' });
  assert.equal(short, 'Choose a password with at least 6 characters.');
  assert.equal(checkForm({ mode: 'signUp', email: 'a@b.co', password: '123456' }), null);
  assert.equal(checkForm({ mode: 'signIn', email: 'a@b.co', password: '12345' }), null);
});

test('progress rows count finished exercises per course and round the percentage', () => {
  const courses = [
    { id: 'python', title: 'Python', total: 3, itemIds: ['a', 'b', 'c'] },
    { id: 'empty', title: 'Empty', total: 0, itemIds: [] },
  ];
  assert.deepEqual(progressRows(courses, new Set(['a', 'b', 'zzz'])), [
    { id: 'python', title: 'Python', done: 2, total: 3, pct: 67 },
    { id: 'empty', title: 'Empty', done: 0, total: 0, pct: 0 },
  ]);
  assert.equal(progressRows(courses, new Set())[0]!.pct, 0);
  assert.equal(progressRows(courses, new Set(['a', 'b', 'c']))[0]!.pct, 100);
});
