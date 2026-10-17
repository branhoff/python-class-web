const ISSUES_URL = 'https://github.com/branhoff/python-class-web/issues/new';

export interface ReportPage {
  title: string;
  path: string;
}

function reportBody(page: ReportPage): string {
  return `Page: ${page.title}
Address: ${page.path}

## What is wrong or confusing?

Say what you read or ran. Quote the text, or paste your code and its output, if that helps.

## What did you expect instead?

## Anything else?

For example, what you already tried, or your browser if the page looked broken.
`;
}

export function reportProblemUrl(page: ReportPage): string {
  const url = new URL(ISSUES_URL);
  url.searchParams.set('title', `Problem on: ${page.title}`);
  url.searchParams.set('body', reportBody(page));
  return url.href;
}
