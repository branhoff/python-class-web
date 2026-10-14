import { defineConfig, devices } from '@playwright/test';

// End-to-end smoke tests: a real browser loads a lesson page, Pyodide boots, and
// we drive the Run buttons like a learner. Slow (browser + wasm), so this is a
// separate CI job and `make smoke` — never the fast gate. Needs vendor/pyodide
// present (run `make pyodide` first).
const PORT = 8123;

export default defineConfig({
  testDir: './test/e2e',
  testMatch: '**/*.smoke.spec.ts',
  timeout: 60_000,
  expect: { timeout: 30_000 },
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node src/server.ts',
    url: `http://localhost:${PORT}/health`,
    reuseExistingServer: !process.env['CI'],
    timeout: 60_000,
    env: { PORT: String(PORT), DEV_AUTH_USER: 'smoke-user' },
  },
});
