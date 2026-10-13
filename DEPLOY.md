# DEPLOY.md — shipping it

The **deployment & delivery baseline**, companion to `AGENTS.md`. Same
philosophy: the hard-won practices that are easy to skip when you just want it
live — **enforced, not aspirational** — written capability-first so the concrete
tool stays swappable. Defaults: **OpenTofu** for infrastructure-as-code,
**GitHub Actions** for the pipeline, **keyless OIDC** for cloud auth.

> Adopting this template: keep this file, fill the `<PLACEHOLDERS>`, pick your
> cloud's column in the matrix below, and wire the two workflows
> (`.github/workflows/infra.yml`, `deploy.yml`) + the `infra/` roots.

## When you need this

The moment something has to run somewhere other than a laptop. If the project is
a library or a CLI, you may only need the release half (build + publish an
artifact) and can skip the infrastructure half. Everything here is still worth
reading once — the traps (secrets in state, non-keyless CI auth, bootstrap
ordering) are cheap to avoid up front and expensive to retrofit.

## The capabilities

Every deployable project should have _something_ in each row:

| Capability                  | Default                             | Why                                                                  |
| --------------------------- | ----------------------------------- | -------------------------------------------------------------------- |
| **Infra as code**           | OpenTofu                            | the environment is reproducible and reviewable, not clicked together |
| **Remote, versioned state** | cloud object store                  | state is shared, locked, and rollback-able; never on one laptop      |
| **Keyless CI→cloud auth**   | OIDC / Workload Identity Federation | no long-lived cloud key sitting in CI secrets                        |
| **Secret storage**          | cloud secret manager                | app secrets never land in IaC state or the running config            |
| **Immutable artifacts**     | SHA-tagged image/package            | every release is traceable; rollback = redeploy an old tag           |
| **Gated release**           | deploy runs only after CI is green  | nothing ships that failed types/lint/tests/mutation                  |

## Per-cloud tooling

The capability is the requirement; the cloud service is swappable.

| Capability             | GCP                               | AWS                                                       | Azure                       |
| ---------------------- | --------------------------------- | --------------------------------------------------------- | --------------------------- |
| **Keyless CI auth**    | Workload Identity Federation → SA | OIDC → IAM role (`aws-actions/configure-aws-credentials`) | OIDC → federated credential |
| **Remote state**       | GCS bucket (versioned)            | S3 + DynamoDB lock                                        | Blob Storage + lease        |
| **Secret manager**     | Secret Manager                    | Secrets Manager / SSM                                     | Key Vault                   |
| **Artifact registry**  | Artifact Registry                 | ECR                                                       | ACR                         |
| **Serverless runtime** | Cloud Run                         | App Runner / ECS Fargate / Lambda                         | Container Apps              |

## The rules (why each exists)

### 1. Infrastructure is code, with remote versioned state

No clicking in a console. The whole environment is OpenTofu, and state lives in a
versioned remote backend — never on one machine — so CI and humans share one
truth and a bad apply can roll back to a prior generation.

### 2. Bootstrap is a separate, run-once root

There is a chicken-and-egg: the state backend and the identity CI uses must exist
_before_ CI can run OpenTofu. So split into two roots:

- `infra/bootstrap/` — **local state, run once by a human** with their own creds.
  Creates the state bucket, the artifact registry, the CI deploy identity, and the
  OIDC/WIF trust. Rarely touched again.
- `infra/` — **remote state, runs in CI.** Everything recurring: the runtime,
  database, secrets _containers_, runtime identity.

### 3. CI authenticates to the cloud keylessly

Use OIDC / Workload Identity Federation so GitHub mints a short-lived token the
cloud trusts — scoped to _this repo_. **No long-lived cloud key in CI secrets**;
a leaked key is the worst-case blast radius and keyless removes it entirely.

### 4. Secrets live in a secret manager, and never touch state or config

GitHub Actions secrets are the edit surface. The deploy workflow **syncs them
into the cloud secret manager** at deploy time; the runtime mounts them by
reference. A secret value must **never** appear in OpenTofu state, in a committed
`.tfvars`, or in the plaintext of a revision/task definition. In IaC, create the
secret _container_ with a placeholder version and `ignore_changes` on the value.

### 5. One owner per field — so IaC and the pipeline don't fight

IaC owns the whole service _definition_ **except** the two things the pipeline
owns: the **image tag** and the **secret versions**. Mark those
`ignore_changes` in IaC. Otherwise every deploy and every `apply` revert each
other and you chase phantom drift forever.

### 6. Artifacts are immutable and traceable

Build and push one artifact per release, tagged with the **git SHA**, never a
moving `latest`. The running revision is then traceable to an exact commit, and
rollback is just redeploying the previous SHA. Add a registry retention/cleanup
policy early — SHA-tagged images and secret versions accumulate and cost money.

### 7. The deploy gate is CI-green — mind what that costs

Deploy triggers only after the CI quality gate passes on `main` (e.g. a
`workflow_run` trigger that proceeds only on `conclusion == success`). Good: no
weak build ships. But remember **mutation testing is slow** — if it gates CI and
CI gates deploy, every release waits on it (easily ~an hour). Decide
deliberately: mutation on every push, or nightly / PR-only with `verify` as the
deploy gate. Latency to production is a feature.

### 8. Least-privilege deploy identity — and the one grant it can't give itself

Grant the CI identity granular roles, not `editor`/`owner`. One catch worth
knowing: if IaC manages a **project/account-level IAM binding**, the deploy
identity needs permission to read & set that policy (e.g. GCP
`resourcemanager.projectIamAdmin`) — and it **cannot grant that to itself** (it
_is_ the identity running the apply). An owner grants it once, out-of-band, at
bootstrap. Plan for that manual step.

### 9. Idempotent, self-healing releases

- **Schema**: prefer idempotent `CREATE … IF NOT EXISTS` on boot, or a one-shot
  migration step — never a manual DB change.
- **Cold start**: the runtime service must exist before the pipeline updates its
  image. Create it in IaC with a **placeholder image** + `ignore_changes`, so the
  first deploy has something to update instead of racing a not-yet-created
  service.
- Releases must be safe to re-run; a redeploy of the same SHA is a no-op.

### 10. Know your cost floor

Serverless + scale-to-zero is near-free when idle. The usual exception is a
managed database, which bills 24/7. Pick the smallest tier that works, keep
scale-to-zero on everything that supports it, and write the expected monthly
floor in `README.md` so it is a decision, not a surprise.

## The pipeline (two workflows + the gate)

```
PR  ──▶ ci.yml      verify + mutation         (the quality gate — see AGENTS.md)
    ──▶ infra.yml   tofu fmt/validate/plan     (plan is the review artifact)

merge main ──▶ ci.yml      (gate runs again)
           ──▶ infra.yml   tofu apply          (gated by a `production` environment)
           ──▶ deploy.yml   on CI success: build+push SHA artifact
                            → sync secrets → release/update the runtime
```

`deploy.yml` is `workflow_run`-triggered after `ci.yml`, plus `workflow_dispatch`
for a manual redeploy. See the two YAMLs for the fill-in `TODO`s.

## Adoption checklist

1. Fill `infra/bootstrap/` and run it **once** locally; set its outputs as GitHub
   repo **variables** and the state bucket name.
2. Fill `infra/` (runtime, DB, secret containers, runtime identity) and the two
   workflows' `TODO`s.
3. Add repo **secrets** (app secrets the deploy workflow syncs) and **variables**
   (project/region/identity/registry).
4. Create a **`production`** GitHub Environment to gate `apply` (a required
   reviewer needs a paid plan on private repos — otherwise it is ungated; decide
   accordingly).
5. Grant the deploy identity the one project-IAM role it can't self-grant (§8).
6. Open a PR → read the `plan`; merge → watch `apply` then `deploy`.
