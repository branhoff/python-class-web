import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseLesson } from '../src/lessons/parse.ts';
import { cellsOf, HEADER } from './lesson-helpers.ts';

test('backticks in the middle of a prompt line do not start a code block in a cell', () => {
  const [cell] = cellsOf(`${HEADER}
:::cell id=mid-line
Wrap code in \`\`\`triple backticks\`\`\` to fence it.

\`\`\`python starter
x = 1
\`\`\`
:::
`);
  assert.equal(cell!.prompt, 'Wrap code in ```triple backticks``` to fence it.');
  assert.equal(cell!.starter, 'x = 1');
});

test('a space between the fence and the language is allowed', () => {
  const [cell] = cellsOf(`${HEADER}
:::cell id=spaced
\`\`\` python starter
x = 1
\`\`\`
:::
`);
  assert.equal(cell!.starter, 'x = 1');
});

test('extra spaces between the language and the role are allowed', () => {
  const [cell] = cellsOf(`${HEADER}
:::cell id=wide
\`\`\`python   starter
x = 1
\`\`\`
:::
`);
  assert.equal(cell!.starter, 'x = 1');
});

test('a line that merely starts with :::cell is text, not a cell', () => {
  const lesson = parseLesson(`${HEADER}
:::cellular biology is fun
`);
  assert.deepEqual(lesson.blocks, [{ type: 'markdown', text: ':::cellular biology is fun' }]);
});
