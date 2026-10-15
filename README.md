# python-class-web

A web app for learning to code in the browser. The home page is a catalog of
courses, shown as squares; pick one to work through notebook-style lessons with
runnable exercise cells, and finish each section with a project you build and
test on your own machine. The first course is a web version of the
`python_class_101` course; more are placeholders for now. Each learner's
progress (exercises completed) is tracked per course and shown on the home page.

Status: **early scaffold.** The plan and decisions are in
[`docs/PLAN.md`](docs/PLAN.md); quality rules in [`AGENTS.md`](AGENTS.md);
deployment rules in [`DEPLOY.md`](DEPLOY.md).

## Develop

Requires Node >= 22.18 (developed on 26), `gitleaks`, and `habit-hooks` with the
TypeScript plugin. `make doctor` checks all of this and tells you what to install.
The Firestore emulator runs in a container (Apple `container` or Docker), so
Java is not needed unless you have neither.

```bash
make doctor    # check required tools; prints how to install anything missing
make setup     # run doctor, install deps, enable the pre-commit hook
make verify    # the full gate; must be green before a change is done
make help      # all targets
DEV_AUTH_USER=me make dev   # run locally as one fixed user (in-memory, no sign-in UI)
make dev-auth               # run locally with a fake sign-in server (see below)
make firestore-emulator     # containerized emulator; then, in another shell:
make test-integration
```

### Trying sign-in locally

`make dev-auth` starts the app with a small in-repo stand-in for Identity
Platform (`src/dev-identity.ts`), mounted at `/dev-identity`. It speaks the same
REST endpoints and error codes as the real service and signs real RS256 tokens,
so the server checks them through the same code as production. Sign up, sign
in, token refresh and password reset all work with no cloud project. Accounts
and progress live in memory and vanish when you restart. A password reset
prints a line to the terminal instead of sending an email.

Every page has a Sign in button at the top right that opens `/account`, where
learners sign in, create an account, reset a password, sign out and see their
progress. Locally with `make dev` (a fixed user) the button shows that user
instead, and on a server with no sign-in configured the account page says so.

It is development only: the server refuses to start with `AUTH_EMULATOR=1` when
`GCP_PROJECT` is also set. In production, sign-in turns on when the service has
both `GCP_PROJECT` and `IDENTITY_PLATFORM_API_KEY`; the key reaches Cloud Run
through an approved `infra` apply.

## Layout

```
src/
  app.ts                  Hono routes (health, progress events and summary)
  auth.ts                 Authenticator contract (header -> our user ID)
  identity-platform.ts    ID-token verifier implementing it
  lessons/                lesson parser, checker, Python test harness, HTML renderer
  progress.ts             progress derived from the event log
  repository/             storage contract + backends (memory now, Firestore next)
test/                     node:test suites; contract.ts is shared by all backends
content/                  one folder per course (content/python/...); lessons as markdown (see docs/LESSON_FORMAT.md)
scripts/                  lesson build/check tools, plus the solution test runners (see docs/LESSON_FORMAT.md)
infra/                    OpenTofu (bootstrap/ run once; live root runs in CI)
```

## How Python runs in the browser

Learner code runs in Pyodide inside a **web worker** (`src/client/py-worker.js`),
so a loop that never ends cannot freeze the page. The page side is
`src/client/py-runner.js`: it runs one program at a time, streams output into
the cell, and enforces the limits. The server never executes learner code.

- **Output** is streamed from the harness as the program writes it, so a prompt
  such as "Please enter five numbers." is visible before the program asks.
- **`input()`** blocks the worker on shared memory (`Atomics.wait`) while the page
  shows an inline box. The typed line is echoed into the output like a terminal.
- **Stop and the time limit** write a signal into a shared interrupt flag, which
  makes Python raise `KeyboardInterrupt`. If Python does not respond within 1.5
  seconds (code stuck in a long C-level loop), the worker is ended and replaced.
  The 10 second limit does not count time spent waiting for typed input.
- **Shared memory needs cross-origin isolation.** `src/isolation.ts` adds
  `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy:
require-corp` to every response. Anything the pages load from another origin
  must now allow it (send a CORP header, or be fetched with CORS); today
  everything is same-origin. If the headers are missing, the cells say Python
  is unavailable and explain why.

## What counts as done

Progress is an append-only log of events per learner (`completed`, `reopened`,
`attempt`), and a learner's state is derived from it (`src/progress.ts`). Two
kinds of thing can be finished:

- an **exercise** cell, finished when its tests pass in the browser;
- a **project**, which is built on the learner's own computer, so it is finished
  when the learner ticks "I finished this project". Ticking records `completed`
  for the id `project:<page id>`, and unticking records `reopened`, which takes
  it back out (the log itself is never edited).

A lesson or project page is complete when everything it contains is finished.
The sidebar check marks, the section counts, the course card and the account
page all count both kinds. The total is the number of exercises plus the number
of projects.

**Continue where you left off.** Each lesson page remembers the learner's last
page in `localStorage`, per account. The home and course pages offer a link to
that page if it still has something to finish, or to the next page that does.
On a device that remembers nothing, the server's most recent completed item
stands in. The rule is `continueTarget` in `src/client/continue.js`.

## How the HTML is tested

`src/lessons/render.ts` and `home.ts` build pages as strings. The tests check
the structure a learner relies on (the Run button, the sidebar, that the solution
is never shipped), not the exact markup. Pinning every tag and
CSS value would break on each intentional style change and say little about
correctness.

The two pieces of real logic in that code are tested directly: whether a cell
shows a prompt, and how hints are numbered. The CSS lives in
`src/lessons/styles.ts`, which holds no behavior and is excluded from mutation
testing in `stryker.config.json`. Mutants there would only change a colour or a
margin, so they would add noise without finding bugs.
