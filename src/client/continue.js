/* Browser-only: remembers the page a learner was last on and, on the home and
   course pages, offers a link back to where they left off. The choice of page
   is the pure continueTarget, which is unit-tested. The last page is kept in
   localStorage per account (so it works signed out too); when a new device has
   no memory yet, the server's last completed item stands in for it. */

import { authHeader, ready } from './app-shell.js';

const KEY_PREFIX = 'pcw.last:';

function isDone(page, completed) {
  return page.itemIds.length > 0 && page.itemIds.every((id) => completed.has(id));
}

// First page after `from` that still needs the learner: not complete, or a page
// with nothing to complete (reading).
function advance(pages, from, completed) {
  for (let index = from + 1; index < pages.length; index += 1) {
    if (!isDone(pages[index], completed)) return pages[index];
  }
  return null;
}

export function continueTarget({ pages, lastId, completed, lastCompletedCell }) {
  const hasHistory = pages.some((page) => page.itemIds.some((id) => completed.has(id)));
  let anchor = lastId === null ? -1 : pages.findIndex((page) => page.id === lastId);
  if (anchor < 0 && lastCompletedCell) {
    anchor = pages.findIndex((page) => page.itemIds.includes(lastCompletedCell));
  }
  if (anchor < 0) {
    if (!hasHistory) return null;
    const first = pages.find((page) => page.itemIds.length > 0 && !isDone(page, completed));
    return first ? { page: first, reason: 'next' } : null;
  }
  const here = pages[anchor];
  if (here.itemIds.length > 0 && !isDone(here, completed)) return { page: here, reason: 'resume' };
  const next = advance(pages, anchor, completed);
  return next ? { page: next, reason: 'next' } : null;
}

export function continueLabel({ page }) {
  return page.project ? `${page.title} (project)` : page.title;
}

export function storageKey(user) {
  return `${KEY_PREFIX}${user ?? 'anonymous'}`;
}

async function fetchSummary() {
  try {
    const res = await fetch('/progress/summary', { headers: await authHeader() });
    if (!res.ok) return { completed: new Set(), lastCompletedCell: null };
    const summary = await res.json();
    return {
      completed: new Set(summary.completedCells ?? []),
      lastCompletedCell: summary.lastCompletedCell ?? null,
    };
  } catch {
    return { completed: new Set(), lastCompletedCell: null };
  }
}

function readMeta() {
  try {
    return JSON.parse(document.getElementById('progress-meta')?.textContent ?? '{}');
  } catch {
    return {};
  }
}

async function main() {
  const { auth, config } = await ready;
  const slot = storageKey((auth && auth.currentUser()) || config.devUser || null);
  const lesson = document.querySelector('main[data-lesson-id]');
  if (lesson) localStorage.setItem(slot, lesson.dataset.lessonId);

  const banner = document.getElementById('continue');
  if (!banner) return;
  const lastId = localStorage.getItem(slot);
  const { completed, lastCompletedCell } = await fetchSummary();
  const links = [];
  for (const info of Object.values(readMeta())) {
    const target = continueTarget({ pages: info.pages, lastId, completed, lastCompletedCell });
    if (!target) continue;
    const link = document.createElement('a');
    link.className = 'continue-link';
    link.href = `/lessons/${encodeURIComponent(target.page.id)}`;
    link.textContent = continueLabel(target);
    links.push(link);
  }
  if (links.length === 0) return;
  const label = document.createElement('span');
  label.className = 'continue-label';
  label.textContent = 'Where you left off';
  banner.replaceChildren(label, ...links);
  banner.hidden = false;
}

if (typeof document !== 'undefined') main();
