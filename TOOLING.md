# TOOLING.md — concrete tools per capability

`AGENTS.md` describes _capabilities_ (lint, format, type-check, coverage,
mutation, structural checks, dead-code/dep hygiene). This file maps each
capability to real tools per language. Pick your language's column, wire the
tools into the `Makefile` variables, and delete the rest.

The point: **the capability is the requirement; the tool is an implementation
detail.** Every project should have _something_ in each row, even if the row is
"not applicable, compensated by X."

| Capability                         | JavaScript / TypeScript                                   | Python                                                                                                                     | Go                                                  | Rust                                               | C / C++                                  |
| ---------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------- | ---------------------------------------- |
| **Formatter**                      | Prettier                                                  | Black / `ruff format`                                                                                                      | `gofmt` / `gofumpt`                                 | `rustfmt`                                          | `clang-format`                           |
| **Linter**                         | ESLint                                                    | Ruff / Flake8 + pylint                                                                                                     | `go vet` / `golangci-lint`                          | `clippy`                                           | `clang-tidy` / `cppcheck`                |
| **Type checker**                   | `tsc --noEmit`                                            | `mypy` / `pyright`                                                                                                         | (built into compiler)                               | (built into compiler)                              | compiler `-Wall -Wextra -Werror`         |
| **Test runner**                    | `node --test` / Vitest / Jest                             | `pytest`                                                                                                                   | `go test`                                           | `cargo test`                                       | CTest / GoogleTest / Unity               |
| **Coverage (enforced)**            | `node --test --experimental-test-coverage` / `c8` / `nyc` | `coverage.py` / `pytest-cov --cov-fail-under`                                                                              | `go test -cover`                                    | `cargo-llvm-cov` / `tarpaulin`                     | `gcov` / `lcov` / `llvm-cov`             |
| **Mutation testing**               | Stryker                                                   | `mutmut` / `cosmic-ray`                                                                                                    | `go-mutesting` / `gremlins`                         | `cargo-mutants`                                    | `mull` / `dextool mutate`                |
| **Dead code / unused deps**        | `knip`                                                    | `vulture` / `deptry` / `pip-audit`                                                                                         | `deadcode` / `go mod tidy`                          | `cargo-udeps` / `cargo-machete`                    | `cppcheck --enable=unusedFunction`       |
| **Structural checks**              | `habit-hooks`                                             | `habit-hooks`                                                                                                              | `habit-hooks`                                       | `habit-hooks`                                      | `habit-hooks`                            |
| **Google style** (`AGENTS.md` §10) | `gts` (Google ESLint + Prettier config)                   | `pyink` or `ruff format --line-length 80`; ruff with `pydocstyle` `convention = "google"`; pylint with Google's `pylintrc` | `gofmt` + `golangci-lint` (`revive`, `staticcheck`) | n/a — no Google guide; `rustfmt`/`clippy` defaults | `clang-format -style=Google` + `cpplint` |
| **Secret scanning**                | `gitleaks`                                                | `gitleaks`                                                                                                                 | `gitleaks`                                          | `gitleaks`                                         | `gitleaks`                               |
| **Toolchain pin**                  | `.nvmrc` / `engines`                                      | `.python-version`                                                                                                          | `go.mod` `toolchain`                                | `rust-toolchain.toml`                              | pinned compiler in CI image              |

Other languages follow the same Google-style approach: Java
(`google-java-format` + Checkstyle `google_checks.xml`), shell (`shfmt -i 2 -ci`

- `shellcheck`), Markdown/YAML/JSON (Prettier).

## Per-language `.gitignore`

Append your language's block to the baseline `.gitignore`:

| Language | Add                                                                                                |
| -------- | -------------------------------------------------------------------------------------------------- |
| JS / TS  | `node_modules/`, `dist/`, `.next/`, `*.tsbuildinfo`                                                |
| Python   | `__pycache__/`, `*.pyc`, `.venv/`, `.mypy_cache/`, `.ruff_cache/`, `.pytest_cache/`, `*.egg-info/` |
| Go       | `bin/`, `vendor/` (if not vendoring), `*.test`, `*.out`                                            |
| Rust     | `target/`                                                                                          |
| C / C++  | `build/`, `*.o`, `*.a`, `*.so`, `*.dylib`                                                          |

Notes:

- **Coverage must _fail the build_** below a threshold — a coverage report no one
  gates on is decoration. Set thresholds high enough to force tests on new code
  (e.g. lines 90 / branches 85), tune to the project.
- **Mutation testing is the quality check on your tests.** Set a `break`
  threshold with headroom below your real score (concurrent test suites can vary
  run-to-run). Exclude files that are pure wiring/entrypoints from mutation.
- **Structural checks** (`habit-hooks`, `uv tool install habit-hooks`) run per
  file (`habit-hooks --file <path>`) or over everything (`--all`). Config lives
  in `.habit-hooks/config.toml`: list the plugins and the `files` globs to scan
  (a generic-only project that names no `files` scans nothing). Plugins exist
  for python, typescript, php, java and ruby, installed as extras
  (`habit-hooks[python]`); other languages use `generic` (oversized files,
  duplicated code via `jscpd`). `jscpd` reads a project `.jscpd.json`; point its
  `path` at your source, since the bundled fallback assumes `src/`.
- Prefer **built-in / standard-library** tooling (fewer deps) when it's good
  enough — e.g. `node --test` and `node:sqlite` over third-party equivalents.
- **Lockfiles encode a registry.** If you generate the lock behind a corporate
  mirror (internal npm/PyPI/Go/Cargo registry), its pinned URLs may be
  unreachable from a public CI runner — the install passes locally and fails in
  CI. Keep the lock pointing at portable public sources, or repoint the registry
  in a CI step before install. See `AGENTS.md` §7.
- **Deployment tooling** lives in `DEPLOY.md` (OpenTofu for IaC, GitHub Actions
  for the pipeline, keyless OIDC auth, cloud secret managers) — same
  capability-first, tool-swappable approach, with a per-cloud matrix.
