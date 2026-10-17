import { reportProblemUrl, type ReportPage } from './report.ts';

export function renderTopbar(left = ''): string {
  return `<nav class="topbar" aria-label="Site"><a class="wordmark" href="/">Understand<span>It</span></a><span class="topbar-left">${left}</span><a id="account-link" class="account-link" href="/account">Sign in</a></nav>`;
}

export function renderReportFooter(page: ReportPage): string {
  const href = reportProblemUrl(page).replaceAll('&', '&amp;');
  return `<footer class="report"><a href="${href}" target="_blank" rel="noopener noreferrer">Report a problem with this page</a></footer>`;
}
