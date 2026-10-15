export function renderTopbar(left = ''): string {
  return `<nav class="topbar" aria-label="Site"><span class="topbar-left">${left}</span><a id="account-link" class="account-link" href="/account">Sign in</a></nav>`;
}
