const TESTS_MARKER = '# ---- Tests ----\n';
const RUN_MARKER = '# ---- Run the tests ----\n';
const PROGRAM_PREFIX = "PROGRAM = r'''\n";
const PROGRAM_SUFFIX = "'''\n";
export const SOLUTION_PREFIX = 'solution-';
export const TESTS_PREFIX = 'tests-';

interface SolutionParts {
  solution: string;
  tests: string;
}

interface ScriptTestsParts {
  program: string;
  tests: string;
}

function testsSection(afterTestsMarker: string | undefined, extra: string[]): string {
  if (afterTestsMarker === undefined || extra.length > 0) {
    throw new Error(`expects exactly one "${TESTS_MARKER.trim()}" line`);
  }
  const [tests, afterTests, ...extraRuns] = afterTestsMarker.split(RUN_MARKER);
  if (afterTests === undefined || extraRuns.length > 0) {
    throw new Error(`expects exactly one "${RUN_MARKER.trim()}" line`);
  }
  if (!/^\s*def test_/m.test(tests!)) {
    throw new Error('has no test methods (expected at least one "def test_...")');
  }
  return `${tests!.trimEnd()}\n`;
}

export function splitSolution(code: string): SolutionParts {
  const [solution, afterSolution, ...extra] = code.split(TESTS_MARKER);
  return { solution: `${solution!.trimEnd()}\n`, tests: testsSection(afterSolution, extra) };
}

export function splitScriptTests(code: string): ScriptTestsParts {
  if (!code.startsWith(PROGRAM_PREFIX)) {
    throw new Error(`must start with ${PROGRAM_PREFIX.trim()}`);
  }
  const end = code.indexOf(PROGRAM_SUFFIX, PROGRAM_PREFIX.length);
  if (end === -1) {
    throw new Error(`the PROGRAM string is never closed with ${PROGRAM_SUFFIX.trim()}`);
  }
  const program = code.slice(PROGRAM_PREFIX.length, end);
  const [between, afterMarker, ...extra] = code
    .slice(end + PROGRAM_SUFFIX.length)
    .split(TESTS_MARKER);
  if (between!.trim() !== '') {
    throw new Error('expects nothing between the PROGRAM string and the tests marker');
  }
  return { program: `${program.trimEnd()}\n`, tests: testsSection(afterMarker, extra) };
}
