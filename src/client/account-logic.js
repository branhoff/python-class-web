/* Pure decisions behind the account page and the top-right account button, kept
   free of the DOM so they are unit-tested in Node. */

const MIN_PASSWORD_LENGTH = 6;

export function accountLink({ user, devUser, path }) {
  if (user) return { label: user, href: '/account', signedIn: true, hidden: false };
  if (devUser)
    return { label: `${devUser} (dev)`, href: '/account', signedIn: true, hidden: false };
  const onAccountPage = path === '/account';
  const next = onAccountPage ? '' : `?next=${encodeURIComponent(path)}`;
  return { label: 'Sign in', href: `/account${next}`, signedIn: false, hidden: onAccountPage };
}

export function accountView({ config, user }) {
  if (config.devUser) return 'dev';
  if (!config.apiKey) return 'unavailable';
  return user ? 'signed-in' : 'sign-in';
}

export function safeNext(raw) {
  if (typeof raw !== 'string' || !raw.startsWith('/')) return '/';
  if (raw.startsWith('//') || raw.startsWith('/\\')) return '/';
  return raw;
}

export function checkForm({ mode, email, password }) {
  if (!email.includes('@')) return 'Enter your email address.';
  if (mode === 'reset') return null;
  if (password === '') return 'Enter your password.';
  if (mode === 'signUp' && password.length < MIN_PASSWORD_LENGTH) {
    return `Choose a password with at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

export function progressRows(courses, completed) {
  return courses.map((course) => {
    const done = course.itemIds.filter((id) => completed.has(id)).length;
    const pct = course.total === 0 ? 0 : Math.round((done / course.total) * 100);
    return { id: course.id, title: course.title, done, total: course.total, pct };
  });
}
