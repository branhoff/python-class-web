import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const SCRIPT = join(process.cwd(), '.github/scripts/refuse-stale-image.sh');
const SERVICE = 'google_cloud_run_v2_service.app';

const FAKE_TOFU = `#!/usr/bin/env bash
echo "tofu $@" >> "$CALLS"
[ "\${TOFU_FAIL:-}" = 1 ] && exit 1
cat "$PLAN_JSON"
`;

const FAKE_GCLOUD = `#!/usr/bin/env bash
echo "gcloud $@" >> "$CALLS"
[ "\${GCLOUD_FAIL:-}" = 1 ] && exit 1
echo "$LIVE_IMAGE"
`;

function plan(address: string, actions: string[], image?: string) {
  const template = image === undefined ? [] : [{ containers: [{ image }] }];
  return { resource_changes: [{ address, change: { actions, after: { template } } }] };
}

function run(planJson: unknown, liveImage: string, extra: Record<string, string> = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'stale-image-'));
  mkdirSync(join(dir, 'infra'));
  for (const [name, body] of [
    ['tofu', FAKE_TOFU],
    ['gcloud', FAKE_GCLOUD],
  ] as const) {
    writeFileSync(join(dir, name), body);
    chmodSync(join(dir, name), 0o755);
  }
  const planFile = join(dir, 'plan.json');
  writeFileSync(planFile, JSON.stringify(planJson));
  const calls = join(dir, 'calls.log');
  writeFileSync(calls, '');
  const result = spawnSync('bash', [SCRIPT], {
    cwd: dir,
    encoding: 'utf8',
    env: {
      PATH: `${dir}:${process.env['PATH']}`,
      PLAN_JSON: planFile,
      CALLS: calls,
      LIVE_IMAGE: liveImage,
      PROJECT: 'proj',
      REGION: 'us-west1',
      SERVICE: 'svc',
      ...extra,
    },
  });
  return { ...result, calls: readFileSync(calls, 'utf8') };
}

test('a plan that keeps the live image goes ahead', () => {
  const result = run(plan(SERVICE, ['update'], 'repo/app:abc'), 'repo/app:abc');
  assert.equal(result.status, 0);
  assert.match(result.stdout, /keeps the live image: repo\/app:abc/);
});

test('a plan that would write back an older image is refused, naming both images', () => {
  const result = run(plan(SERVICE, ['update'], 'repo/app:old'), 'repo/app:new');
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /::error::Not applying: this plan would write image repo\/app:old/);
  assert.match(result.stdout, /repo\/app:new is live/);
});

test('a plan that does not update the service passes without asking what is live', () => {
  for (const actions of [['no-op'], ['create'], ['delete']]) {
    const result = run(plan(SERVICE, actions, 'repo/app:old'), 'repo/app:new');
    assert.equal(result.status, 0, actions.join());
    assert.doesNotMatch(result.calls, /gcloud/, actions.join());
  }
  const other = run(plan('google_project_service.apis', ['update']), 'repo/app:new');
  assert.equal(other.status, 0);
});

test('an update whose image cannot be read fails loudly instead of passing', () => {
  const result = run(plan(SERVICE, ['update']), 'repo/app:new');
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /image could not be read/);
});

test('it reads the plan from the infra folder and asks about the right service', () => {
  const { calls } = run(plan(SERVICE, ['update'], 'a'), 'a');
  assert.match(calls, /^tofu show -json tfplan$/m);
  assert.match(calls, /^gcloud run services describe svc --region us-west1 --project proj /m);
});

test('if the plan or the service cannot be read, it fails instead of applying', () => {
  assert.notEqual(run(plan(SERVICE, ['update'], 'a'), 'a', { TOFU_FAIL: '1' }).status, 0);
  assert.notEqual(run(plan(SERVICE, ['update'], 'a'), 'a', { GCLOUD_FAIL: '1' }).status, 0);
});
