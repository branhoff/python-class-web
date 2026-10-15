import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const SCRIPT = '.github/scripts/refuse-superseded-apply.sh';

const FAKE_GH = `#!/usr/bin/env bash
echo "$@" >> "$GH_LOG"
[ "\${GH_FAIL:-}" = 1 ] && exit 1
[ -n "$NEWER_RUN" ] && echo "$NEWER_RUN"
exit 0
`;

function run(newerRun: string, extra: Record<string, string> = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'superseded-'));
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
      GITHUB_RUN_ID: '100',
      GH_LOG: log,
      NEWER_RUN: newerRun,
      ...extra,
    },
  });
  return { ...result, calls: readFileSync(log, 'utf8') };
}

test('with no newer infra run on main, the apply goes ahead', () => {
  const result = run('');
  assert.equal(result.status, 0);
  assert.match(result.stdout, /No newer infra run on main/);
});

test('with a newer infra run on main, the apply is refused and names the run', () => {
  const result = run('205');
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /::error::Not applying: infra run 205 on main is newer/);
});

test('it asks only about the infra workflow on main, newer than this run, ignoring pull requests and cancelled runs', () => {
  const { calls } = run('');
  assert.match(calls, /--workflow infra\.yml --branch main/);
  assert.match(calls, /\.databaseId > 100/);
  assert.match(calls, /\.event != "pull_request"/);
  assert.match(calls, /\.conclusion != "cancelled"/);
});

test('if GitHub cannot be reached, it fails instead of applying', () => {
  const result = run('', { GH_FAIL: '1' });
  assert.notEqual(result.status, 0);
});
