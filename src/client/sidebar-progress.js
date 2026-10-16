/* Browser-only: marks completed lessons in the section sidebar. A lesson is
   complete when it has something to finish (quizzes, or the project itself)
   and all of it is done. Each sidebar entry carries those ids in data-items; we
   fetch /progress/summary once, then update live when an item is marked done (a
   passed quiz or a ticked project).
   Best-effort: a signed-out learner (401) or offline gets no markers at all.
   Not imported by the TS graph; the pure functions below are unit-tested. */

import { authHeader } from './app-shell.js';

export function lessonDone(itemIds, completed) {
  return itemIds.length > 0 && itemIds.every((id) => completed.has(id));
}

export function sectionCount(lessons, completed) {
  const withQuizzes = lessons.filter((ids) => ids.length > 0);
  const done = withQuizzes.filter((ids) => lessonDone(ids, completed)).length;
  return { done, total: withQuizzes.length };
}

export function parseItems(attribute) {
  return attribute ? attribute.split(',') : [];
}

function paint(completed) {
  for (const details of document.querySelectorAll('.sidebar details')) {
    const items = [...details.querySelectorAll('li')];
    const lessons = items.map((item) => parseItems(item.dataset.items));
    items.forEach((item, index) => {
      item.classList.toggle('complete', lessonDone(lessons[index], completed));
    });
    const { done, total } = sectionCount(lessons, completed);
    const count = details.querySelector('summary .count');
    if (count) count.textContent = total === 0 ? '' : `${done}/${total}`;
  }
}

async function fetchCompleted() {
  try {
    const res = await fetch('/progress/summary', { headers: await authHeader() });
    if (!res.ok) return null;
    const summary = await res.json();
    return new Set(summary.completedCells ?? []);
  } catch {
    return null;
  }
}

async function main() {
  const completed = await fetchCompleted();
  if (!completed) return;
  paint(completed);
  document.addEventListener('item-done', (event) => {
    if (event.detail.done) completed.add(event.detail.id);
    else completed.delete(event.detail.id);
    paint(completed);
  });
}

if (typeof document !== 'undefined') main();
