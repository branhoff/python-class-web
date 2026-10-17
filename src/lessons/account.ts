import { renderReportFooter, renderTopbar } from './chrome.ts';
import type { Course } from './courses.ts';
import { head, type CourseProgress } from './home.ts';

export interface AccountCourse {
  id: string;
  title: string;
  total: number;
  itemIds: string[];
}

export function accountCourses(
  courses: readonly Course[],
  meta: Record<string, Pick<CourseProgress, 'total' | 'itemIds'>>,
): AccountCourse[] {
  return courses.flatMap((course) => {
    const progress = meta[course.id];
    return progress
      ? [{ id: course.id, title: course.title, total: progress.total, itemIds: progress.itemIds }]
      : [];
  });
}

export function renderAccount(courses: AccountCourse[]): string {
  const data = JSON.stringify({ courses }).replaceAll('<', '\\u003c');
  return `${head('Account')}
<body>
${renderTopbar('<a class="back" href="/">← All courses</a>')}
<h1>Your account</h1>
<main id="account"><p>Loading…</p></main>
${renderReportFooter({ title: 'Your account', path: '/account' })}
<script type="application/json" id="account-data">${data}</script>
<script type="module" src="/static/app-shell.js"></script>
<script type="module" src="/static/account.js"></script>
</body>
</html>
`;
}
