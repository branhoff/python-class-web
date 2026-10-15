/* Browser-only: fills in each available course's progress bar from the learner's
   completed cells. The page embeds, per course, the ids of everything that can be finished (exercises and projects) and the total;
   we fetch /progress/summary and count how many are done. Best-effort: a
   signed-out learner (401) or offline just shows zero progress, never an error.
   Not imported by the TS graph; served to the home page. */

import { authHeader } from './app-shell.js';

function readMeta() {
  const node = document.getElementById('progress-meta');
  try {
    return JSON.parse(node?.textContent ?? '{}');
  } catch {
    return {};
  }
}

async function fetchCompleted() {
  try {
    const res = await fetch('/progress/summary', { headers: await authHeader() });
    if (!res.ok) return new Set();
    const summary = await res.json();
    return new Set(summary.completedCells ?? []);
  } catch {
    return new Set();
  }
}

function paint(card, done, total) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const fill = card.querySelector('.bar > span');
  if (fill) fill.style.width = `${pct}%`;
  const count = card.querySelector('.count');
  if (count) count.textContent = `${done} of ${total} done`;
}

async function main() {
  const meta = readMeta();
  const completed = await fetchCompleted();
  for (const card of document.querySelectorAll('.course.available')) {
    const info = meta[card.dataset.course];
    if (!info) continue;
    const done = info.itemIds.filter((id) => completed.has(id)).length;
    paint(card, done, info.total);
  }
}

if (typeof document !== 'undefined') main();
