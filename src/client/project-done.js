/* Browser-only: the "I finished this project" checkbox on a project page.
   Projects are built on the learner's own computer, so completion is
   self-reported. Checking it records a completed event, unchecking records a
   reopened one, and the sidebar and counts update straight away. Signed out,
   the box stays disabled and says why. Not imported by the TS graph. */

import { authHeader, ready, signedIn } from './app-shell.js';
import { projectEventKind, projectHint } from './project-done-logic.js';

const box = document.getElementById('project-done');
const hint = document.getElementById('project-done-hint');

async function savedAsDone(item) {
  try {
    const res = await fetch('/progress/summary', { headers: await authHeader() });
    if (!res.ok) return false;
    return ((await res.json()).completedCells ?? []).includes(item);
  } catch {
    return false;
  }
}

async function save(item, checked) {
  const res = await fetch('/progress/events', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(await authHeader()) },
    body: JSON.stringify({ cellId: item, kind: projectEventKind(checked) }),
  });
  if (!res.ok) throw new Error('not saved');
}

async function main() {
  await ready;
  const item = box.dataset.item;
  if (!(await signedIn())) {
    const link = document.createElement('a');
    link.href = `/account?next=${encodeURIComponent(location.pathname)}`;
    link.textContent = 'Sign in';
    hint.replaceChildren(link, ' to keep track of your projects.');
    return;
  }
  box.checked = await savedAsDone(item);
  box.disabled = false;
  box.addEventListener('change', async () => {
    const checked = box.checked;
    box.disabled = true;
    try {
      await save(item, checked);
      hint.textContent = projectHint(checked ? 'done' : 'idle');
      document.dispatchEvent(new CustomEvent('item-done', { detail: { id: item, done: checked } }));
    } catch {
      box.checked = !checked;
      hint.textContent = projectHint('error');
    }
    box.disabled = false;
  });
}

if (box) main();
