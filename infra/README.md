# infra/ - infrastructure as code (OpenTofu)

Two roots, because the state backend and the CI identity must exist _before_ CI
can run OpenTofu:

- **[`bootstrap/`](bootstrap/README.md)** - local state, run once by a human.
- **this root** - remote state, runs in CI (`.github/workflows/infra.yml`):
  a PR runs `fmt`, `validate` and `plan`; a merge to `main` runs `apply` behind
  the `production` environment.

## What this root manages

| file         | resources                                                                                                        |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| `main.tf`    | API enablement, the Firestore `(default)` database (delete-protected), Identity Platform config (email/password) |
| `runtime.tf` | runtime service account (`roles/datastore.user` only), the Cloud Run service, public invoker binding             |

There is no Secret Manager and no database password: Cloud Run reaches Firestore
through its service identity, and ID-token verification uses Google's public
keys. Add secret _containers_ here (placeholder version plus `ignore_changes`)
and a sync step in `deploy.yml` when the first real secret appears.

## Ownership split

OpenTofu owns the Cloud Run service definition **except** the container image,
which `deploy.yml` owns (`ignore_changes` on the image). The service is created
with a placeholder image so the first deploy has something to update.

## Run locally (occasionally)

```sh
export TF_STATE_BUCKET=<bootstrap output state_bucket>
export TF_VAR_project_id=<project id>
make tofu-plan
```

Needs `tofu` and `gcloud auth application-default login`.

## Cost

Cloud Run scales to zero; Firestore's free tier covers a cohort of under 100;
Identity Platform's free tier is 50k monthly active users. Expected floor is
about $0. The bootstrap budget (default $10) emails billing admins at 50/90/100%.

## Sign-in providers

Only email/password is configured here. Google or GitHub sign-in needs an OAuth
client secret, which would land in state, so configure those out of band.

## Teardown

Firestore has delete protection on. Set `delete_protection_state` to
`DELETE_PROTECTION_DISABLED`, apply, then destroy.
