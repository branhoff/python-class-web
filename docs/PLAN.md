# Plan

## Goals

- Beginners learn Python basics through lesson pages with runnable cells.
- Each section ends with a project built locally (own IDE, own files), verified
  by a starter-kit test suite the learner runs themselves.
- Small cohort (<100 users) for the proof of concept.

## Decisions so far

| Area              | Decision                                                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| Runtime for cells | Pyodide in a web worker. Learner code never runs on our servers.                                                      |
| Final projects    | Local only for the POC: spec, setup guide, starter kit (stub + pytest suite). No upload; completion is self-reported. |
| Authoring         | Markdown + a small cell syntax, in git, built into the site. CI runs every reference solution against its tests.      |
| Language          | TypeScript on Node (template's JS/TS tooling column).                                                                 |
| Lesson content    | Lives in this repo under `content/<course>/` (one folder per course).                                                 |
| Datastore         | Firestore (native mode, `(default)` database).                                                                        |
| Auth              | Identity Platform (Firebase Auth), email/password first.                                                              |
| Hosting           | Google Cloud Run.                                                                                                     |
| IaC               | OpenTofu, two roots (`infra/bootstrap/` run once locally, `infra/` run in CI).                                        |
| CI/CD             | GitHub Actions, keyless auth via Workload Identity Federation (see `DEPLOY.md`).                                      |
| Quality gate      | `make verify`, plus `make mutation` in CI (see `AGENTS.md`).                                                          |

## Open decisions

- Web framework on Node (Hono as in `ring-capture`, vs. alternatives).
- Front-end approach for the lesson player.
- `input()` handling in cells: inline prompt (proposed) vs. canned input.

## Storage must stay swappable (Firestore -> Postgres)

Firestore is the starting point, not a commitment. These rules keep a later move
to Postgres to a day or two of work, with no client or interface changes:

1. **One repository interface.** All reads and writes go through a
   database-agnostic interface expressed in domain terms
   (`markCellComplete(userId, cellId)`, `getProgress(userId)`), never in
   Firestore terms (no document paths, snapshots, `Timestamp`, or query
   builders in signatures or return types).
2. **Firestore lives in exactly one module.** Only `src/repository/firestore.ts`
   imports a Firestore SDK. A lint rule (restricted imports) enforces it.
3. **Clients never talk to the datastore.** The browser calls our HTTP API only;
   no Firebase client SDK for data, no Firestore security rules as the access
   control. Authorization lives in the API layer.
4. **Contract tests for every implementation.** One shared suite runs against the
   in-memory implementation (fast gate) and the Firestore emulator; a Postgres
   implementation must pass the same suite.
5. **Append-only events over mutable counters.** Record cell attempts and
   completions as timestamped events; derive progress from them.
6. **Own the identifiers.** Records key on our own stable user ID (mapped from
   the auth provider's UID in one place), never on provider-specific fields.
7. **Plain data at the boundary.** IDs are strings, times are epoch
   milliseconds or ISO strings, and no SDK types cross the repository interface.

## Infra (OpenTofu)

Managed in `infra/`: project API enablement, the Firestore database, any
composite indexes, Identity Platform config (email/password), the Cloud Run
service and its runtime service account (`roles/datastore.user` only), and
secret containers. Provider sign-in secrets (Google/GitHub OAuth client
secrets) are not put in state; they are configured out of band or synced by the
deploy workflow per `DEPLOY.md` rule 4. Firestore needs no DB password, so
there is no database secret.

## CI/CD

- `ci.yml`: `verify` (full gate), `mutation`, and `integration` (the repository
  contract against the Firestore emulator in a container). All three are required
  checks.
- `infra.yml`: plan on PRs touching `infra/`, apply on `main` behind the
  `production` environment.
- `deploy.yml`: after CI is green on `main`, build and push a SHA-tagged image,
  update Cloud Run, and smoke-test `/health`. Setup steps are in
  `infra/bootstrap/README.md`.

## Build order

1. Content format spike: convert one notebook (04a Functions) end to end.
2. Pyodide cell runner: web worker, stdin shim, hidden tests, timeouts.
3. Site shell: routing, markdown rendering, navigation.
4. Auth and progress.
5. Project kits: starter-zip generator, project pages, self-report flow.
6. Content migration and CI over all solutions (fix the known solution bugs first).
7. Infra: bootstrap, Cloud Run service, secrets, deploy pipeline.
8. Beta with the cohort.

## Conventions

- `ProgressEvent.at` is epoch milliseconds (UTC); events are append-only and
  `listEvents` returns them oldest first.
- `src/repository/repository.ts` is the only storage contract. Every backend
  implements it and must pass `test/contract.ts`; datastore SDK imports are
  lint-restricted to `src/repository/<backend>.ts`.
- `Authenticator` (`src/auth.ts`) maps an Authorization header to our own user
  ID. The provider-UID-to-our-ID mapping lives only in the Identity Platform
  implementation.
- `src/identity-platform.ts` verifies Firebase/Identity Platform ID tokens
  (RS256, issuer and audience pinned to the project) using `jose`, and maps the
  provider UID to our ID in one function (`idp:<uid>`).
- `src/server.ts` is the only wiring: `GCP_PROJECT` selects Firestore +
  Identity Platform; otherwise it needs `DEV_AUTH_USER` and uses in-memory
  storage with no real auth. Firestore data layout:
  `users/{userId}/events/{autoId}` with `{cellId, kind, at}`.
