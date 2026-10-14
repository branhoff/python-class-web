# Uniform task interface. Every project built from this template exposes the
# SAME verbs, so humans and agents never relearn the interface. Fill in the
# per-language commands below (see TOOLING.md); use `?=` so CI can override.
#
# Each variable should exit non-zero on failure so the gate actually gates.
#
# Note: a few bare names (LINT, CC, TEX, …) are built-in make variables that
# `?=` can't override, so command vars are suffixed `_CMD` to stay collision-proof.
MAKEFLAGS += --no-builtin-rules
.SUFFIXES:

FORMAT_CMD        ?= npm run format
FORMAT_CHECK_CMD  ?= npm run format:check
LINT_CMD          ?= npm run lint
TYPECHECK_CMD     ?= npm run typecheck
TEST_CMD          ?= npm test
COVERAGE_CMD      ?= npm run coverage
MUTATION_CMD      ?= npm run mutation
DEADCODE_CMD      ?= npx knip --production
STRUCTURE_CMD     ?= habit-hooks
SECRETS_CMD       ?= gitleaks detect --no-banner
HYGIENE_FILES     ?= .gitignore .editorconfig .gitattributes LICENSE SECURITY.md CLAUDE.md \
                     .habit-hooks/config.toml .github/CODEOWNERS .github/pull_request_template.md .github/dependabot.yml
HYGIENE_CMD       ?= for f in $(HYGIENE_FILES); do [ -f "$$f" ] || { echo "missing: $$f"; exit 1; }; done

# Infra (OpenTofu). State bucket from infra/bootstrap; pass it as TF_STATE_BUCKET.
# CI runs these keylessly via OIDC/WIF; locally you need `tofu` + cloud ADC.
TF_STATE_BUCKET ?= $(error set TF_STATE_BUCKET to the bootstrap state bucket)

.PHONY: help setup doctor gcp-setup hooks pyodide firestore-emulator test-integration test coverage mutation mutation-sandbox lint format format-check typecheck structure secrets hygiene deadcode check verify clean tofu-plan tofu-apply

# ── Setup ─────────────────────────────────────────────────────────────────────
doctor:
	@./scripts/doctor.sh

setup: doctor hooks
	npm install
	@echo "Setup complete."

# One-time GCP project + bootstrap + GitHub variables. Example:
#   make gcp-setup ARGS="--project my-proj --billing-account XXXXXX-XXXXXX-XXXXXX --dry-run"
gcp-setup:
	./scripts/gcp-setup.sh $(ARGS)

hooks:
	git config core.hooksPath .githooks
	@echo "git hooks enabled (core.hooksPath -> .githooks)"

# Fetch the self-hosted in-browser Python runtime into vendor/ (not committed).
# Needed to run lessons locally; the Docker build does the same step.
pyodide:
	@./scripts/fetch-pyodide.sh vendor/pyodide

# ── The gate ──────────────────────────────────────────────────────────────────
# check = the fast gate (runs on every commit). verify = check + the slower
# structural, dead-code, secret and hygiene checks. Neither runs mutation (too
# slow; CI/manual).
check: typecheck lint format-check coverage

verify: check structure deadcode secrets hygiene

# ── Individual steps ──────────────────────────────────────────────────────────
format:
	$(FORMAT_CMD)

format-check:
	$(FORMAT_CHECK_CMD)

lint:
	$(LINT_CMD)

typecheck:
	$(TYPECHECK_CMD)

test:
	$(TEST_CMD)

coverage:
	$(COVERAGE_CMD)

structure:
	$(STRUCTURE_CMD)

deadcode:
	$(DEADCODE_CMD)

secrets:
	$(SECRETS_CMD)

hygiene:
	@$(HYGIENE_CMD)

# Mutation testing grades test quality, not just coverage. Slow and may bind a
# local socket, so it is intentionally OUT of `check`/pre-commit — run it
# deliberately or in CI before landing substantial logic.
mutation:
	$(MUTATION_CMD)

# Same run for a shell that forbids socket binding (e.g. an agent sandbox): a
# preload shim no-ops Stryker's diagnostic logging socket. Opt-in; scores match.
mutation-sandbox:
	npm run mutation:sandbox

# ── Firestore emulator ────────────────────────────────────────────────────────
# Runs in a container when Apple `container` or Docker is installed, so no Java
# is needed. Falls back to the local gcloud emulator (Java 21+) otherwise. The
# integration tests run the shared repository contract against it; they are not
# part of `check` because they need the emulator running.
EMULATOR_HOST  ?= 127.0.0.1:8080
EMULATOR_PORT  := $(lastword $(subst :, ,$(EMULATOR_HOST)))
EMULATOR_IMAGE ?= gcr.io/google.com/cloudsdktool/google-cloud-cli:emulators
CONTAINER_CLI  ?= $(shell command -v container >/dev/null 2>&1 && echo container || { command -v docker >/dev/null 2>&1 && echo docker; })

firestore-emulator:
ifeq ($(CONTAINER_CLI),)
	@echo "No container runtime found; using the local gcloud emulator (needs Java 21+). Run 'make doctor'."
	gcloud emulators firestore start --host-port=$(EMULATOR_HOST)
else
	-$(CONTAINER_CLI) rm -f python-class-firestore >/dev/null 2>&1
	$(CONTAINER_CLI) run --rm --name python-class-firestore -p 127.0.0.1:$(EMULATOR_PORT):8080 \
		$(EMULATOR_IMAGE) gcloud emulators firestore start --host-port=0.0.0.0:8080
endif

test-integration:
	@nc -z $(subst :, ,$(EMULATOR_HOST)) >/dev/null 2>&1 || { \
		echo "Firestore emulator not reachable at $(EMULATOR_HOST). Run 'make firestore-emulator' in another shell."; exit 1; }
	FIRESTORE_EMULATOR_HOST=$(EMULATOR_HOST) node --test --test-reporter=spec test/firestore.integration.ts

# ── Infra (OpenTofu) ──────────────────────────────────────────────────────────
# Occasional local plan/apply of the live infra/ root. Normal path is CI
# (infra.yml): PR plans, merge applies. See DEPLOY.md.
tofu-plan:
	cd infra && tofu init -backend-config="bucket=$(TF_STATE_BUCKET)" && tofu plan

tofu-apply:
	cd infra && tofu init -backend-config="bucket=$(TF_STATE_BUCKET)" && tofu apply

# ── Clean ───────────────────────────────────────────────────────────────────
# Remove the same artifacts .gitignore hides, so the two don't drift apart.
clean:
	rm -rf reports/ node_modules/.cache

# ── Help ──────────────────────────────────────────────────────────────────────
help:
	@echo ""
	@echo "Usage:"
	@echo "  make doctor        Check required tools and print install hints"
	@echo "  make gcp-setup     One-time GCP + bootstrap + GitHub variables (ARGS=\"--help\")"
	@echo "  make setup         Check tools, install dependencies, enable git hooks"
	@echo "  make check         Fast gate: typecheck + lint + format-check + coverage"
	@echo "  make verify        check + structure + dead-code/dep + secrets + hygiene"
	@echo "  make secrets       Scan for committed credentials (gitleaks)"
	@echo "  make hygiene       Fail if a required repo hygiene file is missing"
	@echo "  make test          Run the test suite"
	@echo "  make coverage      Run tests with enforced coverage thresholds"
	@echo "  make mutation      Grade test quality with mutation testing (slow)"
	@echo "  make lint          Lint"
	@echo "  make format        Auto-format in place"
	@echo "  make format-check  Check formatting without writing"
	@echo "  make typecheck     Static type check"
	@echo "  make structure     Structural/habit checks"
	@echo "  make firestore-emulator  Start the Firestore emulator"
	@echo "  make test-integration    Run the repository contract against the emulator"
	@echo "  make tofu-plan     Plan the live infra/ root (needs TF_STATE_BUCKET + cloud ADC)"
	@echo "  make tofu-apply    Apply the live infra/ root (needs TF_STATE_BUCKET + cloud ADC)"
	@echo "  make clean         Remove build/test artifacts"
	@echo ""
