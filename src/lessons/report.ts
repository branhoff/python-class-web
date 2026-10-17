const ISSUES_URL = 'https://github.com/branhoff/python-class-web/issues/new';

export interface ReportPage {
  title: string;
  path: string;
}

export function reportProblemUrl(page: ReportPage): string {
  const url = new URL(ISSUES_URL);
  url.searchParams.set('title', `Problem on: ${page.title}`);
  url.searchParams.set(
    'body',
    `Page: ${page.title}\nAddress: ${page.path}\n\nWhat is wrong or confusing?\n`,
  );
  return url.href;
}
