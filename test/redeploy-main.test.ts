import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const SCRIPT = '.github/scripts/redeploy-main.sh';

const FAKE_GH = `#!/usr/bin/env bash
echo "$@" >> "$GH_LOG"
if [ "$1" = api ]; then
  [ "\${GH_FAIL:-}" = api ] && exit 1
  echo abc123
elif [ "$1 $2" = "run list" ]; then
  [ -n "$CI_RESULT" ] && echo "$CI_RESULT"
  exit 0
fi
exit 0
`;

function run(ciResult: string, extra: Record<string, string> = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'redeploy-'));
  const gh = join(dir, 'gh');
  writeFileSync(gh, FAKE_GH);
  chmodSync(gh, 0o755);
  const log = join(dir, 'calls.log');
  writeFileSync(log, '');
  const result = spawnSync('bash', [SCRIPT], {
    encoding: 'utf8',
    env: {
      PATH: `${dir}:${process.env['PATH']}`,
      GITHUB_REPOSITORY: 'owner/repo',
      GH_LOG: log,
      CI_RESULT: ciResult,
      ...extra,
    },
  });
  return { ...result, calls: readFileSync(log, 'utf8') };
}

test('when CI passed on main, it dispatches a deploy of main', () => {
  const result = run('completed success');
  assert.equal(result.status, 0);
  assert.match(result.calls, /^workflow run deploy\.yml --repo owner\/repo --ref main$/m);
  assert.match(result.stdout, /Dispatched a deploy of abc123\./);
});

test('it looks up CI for the head commit of main, on the CI workflow', () => {
  const { calls } = run('completed success');
  assert.match(calls, /^api repos\/owner\/repo\/commits\/main -q \.sha$/m);
  assert.match(calls, /^run list --repo owner\/repo --workflow ci\.yml --commit abc123 --limit 1/m);
});

test('when CI failed on main, it does not deploy and warns that production may be stale', () => {
  const result = run('completed failure');
  assert.equal(result.status, 0);
  assert.doesNotMatch(result.calls, /workflow run/);
  assert.match(result.stdout, /::warning::CI did not pass on abc123 \(completed failure\)/);
  assert.match(result.stdout, /older image than main/);
});

test('a cancelled or skipped CI run is treated like a failure', () => {
  for (const outcome of ['completed cancelled', 'completed skipped']) {
    const result = run(outcome);
    assert.doesNotMatch(result.calls, /workflow run/, outcome);
    assert.match(result.stdout, /::warning::/, outcome);
  }
});

test('while CI is still running it leaves the deploy to the one that follows CI', () => {
  for (const state of ['in_progress ', 'queued ', 'waiting ']) {
    const result = run(state);
    assert.equal(result.status, 0, state);
    assert.doesNotMatch(result.calls, /workflow run/, state);
    assert.match(result.stdout, /::notice::CI is still running on abc123/, state);
  }
});

test('with no CI run for the commit it does nothing and says so', () => {
  const result = run('');
  assert.equal(result.status, 0);
  assert.doesNotMatch(result.calls, /workflow run/);
  assert.match(result.stdout, /::notice::No CI run found for abc123/);
});

test('if GitHub cannot be reached, it fails loudly instead of reporting success', () => {
  const result = run('completed success', { GH_FAIL: 'api' });
  assert.notEqual(result.status, 0);
  assert.doesNotMatch(result.calls, /workflow run/);
});
