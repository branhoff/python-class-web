import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadLessons } from '../src/lessons/load.ts';
import type { Cell } from '../src/lessons/types.ts';
import {
  SOLUTION_PREFIX,
  TESTS_PREFIX,
  splitScriptTests,
  splitSolution,
} from '../src/lessons/solution-cells.ts';

const MUTMUT_CONFIG =
  '[mutmut]\nsource_paths=solution.py\npytest_add_cli_args_test_selection=test_solution.py\n';
const COSMIC_RAY_CONFIG = `[cosmic-ray]
module-path = "solution.py"
timeout = 10.0
excluded-modules = []
test-command = "python -m pytest -x -q -p no:cacheprovider test_solution.py"

[cosmic-ray.distributor]
name = "local"
`;

const [outDir, ...slugs] = process.argv.slice(2);
if (!outDir) {
  console.error('usage: extract-solutions.ts <outdir> [slug...]');
  process.exit(2);
}

function write(dir: string, files: Record<string, string>, lessonId: string): void {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  for (const [name, text] of Object.entries(files)) writeFileSync(join(dir, name), text);
  writeFileSync(join(dir, 'lesson.txt'), `${lessonId}\n`);
}

function scriptFiles(solution: Cell, tests: Cell): Record<string, string> {
  const script = `${solution.starter.trimEnd()}\n`;
  const parts = splitScriptTests(tests.starter);
  if (parts.program.trim() !== script.trim()) {
    throw new Error('the PROGRAM copy in the tests cell differs from the solution cell');
  }
  return {
    'cell.py': `${tests.starter.trimEnd()}\n`,
    'solution.py': script,
    'test_solution.py': `PROGRAM = open("solution.py").read()\n\n${parts.tests}`,
    'engine.txt': 'cosmic-ray\n',
    'cr.toml': COSMIC_RAY_CONFIG,
  };
}

function functionFiles(solution: Cell): Record<string, string> {
  const parts = splitSolution(solution.starter);
  return {
    'cell.py': `${solution.starter.trimEnd()}\n`,
    'solution.py': parts.solution,
    'test_solution.py': `from solution import *\n\n${parts.tests}`,
    'engine.txt': 'mutmut\n',
    'setup.cfg': MUTMUT_CONFIG,
  };
}

if (slugs.length === 0) rmSync(outDir, { recursive: true, force: true });
let count = 0;
for (const { lesson } of loadLessons('content')) {
  const cells = lesson.blocks.filter((block): block is Cell => block.type === 'cell');
  for (const solution of cells.filter((cell) => cell.id.startsWith(SOLUTION_PREFIX))) {
    const slug = solution.id.slice(SOLUTION_PREFIX.length);
    if (slugs.length > 0 && !slugs.includes(slug)) continue;
    const tests = cells.find((cell) => cell.id === `${TESTS_PREFIX}${slug}`);
    try {
      write(
        join(outDir, slug),
        tests ? scriptFiles(solution, tests) : functionFiles(solution),
        lesson.after ?? lesson.id,
      );
    } catch (error) {
      throw new Error(`${lesson.id}/${slug}: ${(error as Error).message}`, { cause: error });
    }
    count += 1;
  }
}
if (count === 0) {
  console.error('no solution cells found');
  process.exit(1);
}
console.log(`extracted ${count} solution(s) to ${outDir}`);
