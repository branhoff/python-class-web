/* Wording and event choice for the "I finished this project" checkbox, kept free
   of the DOM so they are unit-tested in Node. */

export function projectEventKind(checked) {
  return checked ? 'completed' : 'reopened';
}

const HINTS = {
  idle: 'Projects run on your own computer, so you tell us when you are done.',
  done: 'Nice work! This project is marked as done.',
  error: 'Could not save that. Check your connection and try again.',
};

export function projectHint(state) {
  return HINTS[state];
}
