/* Browser-only: marks completed lessons in the section sidebar. A lesson is
   complete when it has at least one exercise cell and every one of them is
   done. Each sidebar entry carries its exercise ids in data-exercises; we fetch
   /progress/summary once, then update live when the runner reports a pass.
   Best-effort: a signed-out learner (401) or offline gets no markers at all.
   Not imported by the TS graph; the pure functions below are unit-tested. */

import { authHeader } from './app-shell.js';

export function lessonDone(exerciseIds, completed) {
  return exerciseIds.length > 0 && exerciseIds.every((id) => completed.has(id));
}

export function sectionCount(lessons, completed) {
  const withExercises = lessons.filter((ids) => ids.length > 0);
  const done = withExercises.filter((ids) => lessonDone(ids, completed)).length;
  return { done, total: withExercises.length };
}

export function parseExercises(attribute) {
  return attribute ? attribute.split(',') : [];
}

function paint(completed) {
  for (const details of document.querySelectorAll('.sidebar details')) {
    const items = [...details.querySelectorAll('li')];
    const lessons = items.map((item) => parseExercises(item.dataset.exercises));
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
  document.addEventListener('cell-completed', (event) => {
    completed.add(event.detail.cellId);
    paint(completed);
  });
}

if (typeof document !== 'undefined') main();
