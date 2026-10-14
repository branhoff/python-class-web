# python-class-web

A web version of the `python_class_101` course: log in, work through
notebook-style lessons with runnable exercise cells, and finish each section with
a project you build and test on your own machine.

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
DEV_AUTH_USER=me make dev   # run locally (in-memory storage, dev-only auth)
make firestore-emulator     # containerized emulator; then, in another shell:
make test-integration
```

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
content/                  lessons as markdown with runnable cells (see docs/LESSON_FORMAT.md)
infra/                    OpenTofu (bootstrap/ run once; live root runs in CI)
```
