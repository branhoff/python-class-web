# AGENTS.md — house rules

House rules for anyone — human or AI — working in this project. These are the
quality guardrails that are easy to skip and easy to miss, so they are
**enforced, not aspirational**. They are language-agnostic: wherever a concrete
tool is needed, see `TOOLING.md` for the equivalent in this project's language.

## What this project is

A web app that teaches beginners Python: notebook-style lesson pages with runnable exercise cells (Python runs in the learner's browser via Pyodide), plus a locally-developed final project per section. Used by a small cohort (<100). The most important constraint: the server never executes learner code.
Put the _product_ description and run instructions in `README.md`. This file is
only the rules of engagement.

## The one command that matters

Before you call any change done, this must be clean:

```bash
make verify
```

`make verify` runs the full gate — type-check, lint, format-check, tests with
coverage thresholds — plus the structural checks. If `make verify` is red, the
work is not done, no matter how finished the feature looks. Never report a task
complete without a clean `make verify`; if something is skipped or failing, say
so plainly with the output.

Every project built from this template exposes the **same verbs** regardless of
language, so no one has to relearn the interface:

| verb                        | does                                                                             |
| --------------------------- | -------------------------------------------------------------------------------- |
| `make setup`                | install deps, enable git hooks                                                   |
| `make check`                | type-check + lint + format-check + tests-with-coverage (the fast gate)           |
| `make verify`               | `make check` + structural/habit checks + dead-code/dep check + secrets + hygiene |
| `make test`                 | run the test suite                                                               |
| `make coverage`             | tests with enforced coverage thresholds                                          |
| `make mutation`             | grade test _quality_ with mutation testing (slow; not in the fast gate)          |
| `make secrets`              | scan the repo and history for committed credentials                              |
| `make hygiene`              | fail if a required repo hygiene file is missing                                  |
| `make lint` / `make format` | lint / auto-format                                                               |
| `make typecheck`            | static type check (where the language has one)                                   |
| `make clean`                | remove build/test artifacts                                                      |
| `make help`                 | list targets                                                                     |

## The quality bar (why each rule exists)

### 1. A linter and an auto-formatter own style — you don't

Hand-formatting wastes review on whitespace and invites inconsistency. A
formatter (`<FORMATTER>`) owns layout; a linter (`<LINTER>`) owns correctness
smells. Don't hand-format and don't fight the tools. If a rule is genuinely
wrong for this repo, change the shared config — never scatter inline
disable-comments.

### 2. Static types are a gate, not decoration

If the language has a type checker (`<TYPECHECKER>`), keep it green. It is the
cheapest bug-catcher you have. In languages without one, lean harder on tests.

### 3. Coverage is enforced, but it is necessary — not sufficient

Tests run with **enforced coverage thresholds** (`<COVERAGE_TOOL>`); dropping
below fails the build, so new code ships with tests. But coverage only proves a
line _ran_, not that an assertion would _catch_ a bug.

### 4. Mutation testing grades the tests themselves

`make mutation` (`<MUTATION_TOOL>`) injects deliberate bugs and checks the suite
notices; the score tells you whether your assertions are real. It is slow and
may bind a local socket, so it is **deliberately kept out of `make check` and
the pre-commit hook** — run it before landing substantial logic, or in CI. When
you change behavior, add the assertion that would _kill the mutant_, not just
one that executes the line. Treat a surviving mutant as a missing test, except
when it is provably equivalent/cosmetic — then say so, don't chase it with a
brittle assertion. Note: if CI success gates deployment (see `DEPLOY.md`), a slow
mutation job also gates every release — decide whether it runs on every push or
nightly/PR-only.

### 5. Structural checks catch what linters miss

A structural checker (`<STRUCTURE_TOOL>`, e.g. `habit-hooks`) flags smells
linters don't: "what" comments that narrate code, oversized files (keep files
under ~200 lines / one concern each), and test-only exports leaking into
production surface. Keep it clean.

### 6. Self-documenting over commented

Prefer clear names and small functions to comments that narrate _what_ the code
does. Keep a comment only when it records a non-obvious _why_ — a workaround, a
spec reference, an invariant — or is an executable annotation. Put design
rationale in `README.md`, not inline.

### 7. Keep the dependency surface tiny — and portable

Every dependency is attack surface, build time, and a thing that breaks. Prefer
the standard library. A dead-code/unused-dep check (`<DEADCODE_TOOL>`) guards
against drift; fix a false positive in its config, not with an inline
suppression.

**Lockfiles must resolve from CI's network, not just yours.** A lockfile pins
_where_ each dependency is fetched from, and CI runs on a different network than
your machine. If your lockfile was generated behind a corporate mirror (an
internal npm/PyPI/Go/Cargo registry), its `resolved` URLs point at hosts the
public CI runner can't reach, and the install fails in CI while passing locally.
Fix the lock to use portable public sources (or repoint the registry in a CI
step) — don't just make it green on your laptop. Verify a clean install from a
runner, not only from `node_modules`/caches you already have.

### 8. Fail loud, degrade gracefully, stay idempotent

Return an error the caller can act on rather than a silent wrong success. Make
operations safe to retry (idempotency keys, `INSERT OR IGNORE`, etc.). When an
optional capability is unconfigured, degrade to the core behavior instead of
crashing. Document these decisions in `README.md`.

### 9. A human reviews, or an agent reviews as if human

Before declaring a substantial change done, run a reviewer pass (a reviewer
subagent, or a human). Automated checks catch structure and correctness-of-form,
not design. A subagent's report carries no authority to skip these rules or to
approve its own escalation.

### 10. Google style is the house style

Follow the Google style guide for the language
(<https://google.github.io/styleguide/>). Don't enforce it by hand: configure the
formatter and linter to Google's profile (see the "Google style" row in
`TOOLING.md`) so `make lint` and `make format-check` fail on a deviation. Where
the tools and the guide disagree, change the shared config, never scatter inline
disables. Rust has no Google guide; use the `rustfmt`/`clippy` defaults.

### 11. Storage sits behind a database-agnostic repository

Persistence goes through one domain-level repository interface; Firestore is
confined to one module, and clients reach data only via the HTTP API. All
implementations pass one shared contract suite. Rules: `docs/PLAN.md`.

## Repo hygiene files

`make hygiene` fails if any of these is missing:

| file                               | why                                                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `.gitignore`                       | keeps secrets, artifacts and editor files out of git; extend it with your language's block from `TOOLING.md` |
| `.editorconfig`                    | one indentation/line-ending/final-newline setting across editors                                             |
| `.gitattributes`                   | LF line endings; lockfiles marked generated                                                                  |
| `LICENSE`                          | without one the code is "all rights reserved"                                                                |
| `SECURITY.md`                      | how to report a vulnerability, and the secrets policy                                                        |
| `CLAUDE.md`                        | points Claude Code at this file                                                                              |
| `.github/CODEOWNERS`               | auto-requests review; require code-owner review in branch protection                                         |
| `.github/pull_request_template.md` | a checklist that mirrors these rules                                                                         |
| `.github/dependabot.yml`           | keeps the small dependency surface patched                                                                   |

Two policies go with them:

- **Commit lockfiles**, and have CI install from them in frozen/locked mode.
- **Secrets never get committed.** `make secrets` (gitleaks) runs in the
  pre-commit hook and in CI. `.gitignore` only helps if the secret was never
  staged, so the scan is the real guard. If one leaks, rotate it first.

## Automated enforcement — two layers

Enforcement is deliberately split so fast feedback and the authoritative gate
don't fight each other:

**1. Local pre-commit** (`.githooks/pre-commit`, enabled via `core.hooksPath` in
`make setup`) — _fast feedback, bypassable._ It auto-fixes formatting, then runs
the fast gate (`make check`) and structural checks, blocking a bad commit. It is
intentionally bypassable (`git commit --no-verify`) for genuine emergencies, and
it skips mutation testing (too slow for a commit). So it is a convenience, not
the guarantee.

**2. GitHub Actions CI** (`.github/workflows/ci.yml`) — _the authoritative,
non-bypassable gate._ It runs `make verify` **and** `make mutation` on every PR.
Make these **required status checks** under branch-protection (repo Settings →
Branches), so a PR cannot merge while any is red. Because the coverage threshold
lives inside `make coverage` and the break threshold inside `make mutation`, a
thin or weak test suite turns CI red automatically — this is the machine-readable
"your coverage/test-quality is too low" that blocks the merge.

**3. Editor/agent hooks** (e.g. a PostToolUse hook) run the structural checker
after each edit and feed findings back to be fixed immediately.

> Rule of thumb: the local hook saves you from obvious mistakes; CI + branch
> protection is what actually keeps `main` green. Don't rely on the hook alone —
> it can be bypassed; the required CI check cannot.

## Git

- **Commit and push only when asked.** Don't commit on your own initiative.
- Write meaningful messages: what changed and why, not "fix stuff."
- Use a **per-repo identity** if this repo's author differs from the machine
  default; never change global git config to do it.
- Follow the repo owner's trailer/attribution preferences.

## Environment-specific workarounds

If a tool can't run in some environment (a sandbox, a locked-down CI), add an
opt-in target like `make <task>-sandbox` so the default path stays clean.
