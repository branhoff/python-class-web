# APIs this bootstrap root needs to create its own resources. The two seed APIs
# (serviceusage, cloudresourcemanager) must already be on - see README.
locals {
  bootstrap_apis = [
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "sts.googleapis.com",
    "storage.googleapis.com",
    "artifactregistry.googleapis.com",
  ]

  # Roles the CI deployer needs so the infra/ root can manage the environment on
  # its behalf. Granular, never roles/editor. State-bucket access is granted on
  # the bucket itself below, not project-wide.
  deployer_roles = [
    "roles/run.admin",
    "roles/datastore.owner",
    "roles/identitytoolkit.admin",
    "roles/firebaseauth.admin",
    "roles/artifactregistry.writer",
    "roles/iam.serviceAccountAdmin",
    "roles/iam.serviceAccountUser",
    "roles/serviceusage.serviceUsageAdmin",
    # The infra/ root binds a project-level role to the runtime SA, so the
    # deployer must read and set the project IAM policy. It cannot grant this to
    # itself; this bootstrap, run by an owner, is what grants it.
    "roles/resourcemanager.projectIamAdmin",
  ]
}

resource "google_project_service" "bootstrap" {
  for_each = toset(local.bootstrap_apis)

  service            = each.value
  disable_on_destroy = false
}

# Versioned so a bad apply can be rolled back to a prior state generation.
resource "google_storage_bucket" "tfstate" {
  name                        = var.state_bucket_name
  location                    = var.region
  uniform_bucket_level_access = true
  force_destroy               = false

  versioning {
    enabled = true
  }

  depends_on = [google_project_service.bootstrap]
}

resource "google_artifact_registry_repository" "images" {
  repository_id = var.ar_repo_name
  location      = var.region
  format        = "DOCKER"
  description   = "python-class-web container images"

  # SHA-tagged images accumulate; keep the 20 most recent, drop untagged.
  cleanup_policies {
    id     = "keep-recent"
    action = "KEEP"
    most_recent_versions {
      keep_count = 20
    }
  }

  cleanup_policies {
    id     = "delete-untagged"
    action = "DELETE"
    condition {
      tag_state = "UNTAGGED"
    }
  }

  depends_on = [google_project_service.bootstrap]
}

resource "google_service_account" "deployer" {
  account_id   = var.deployer_sa_id
  display_name = "python-class-web CI deployer"

  depends_on = [google_project_service.bootstrap]
}

resource "google_project_iam_member" "deployer" {
  for_each = toset(local.deployer_roles)

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.deployer.email}"
}

resource "google_storage_bucket_iam_member" "deployer_state" {
  bucket = google_storage_bucket.tfstate.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.deployer.email}"
}

resource "google_iam_workload_identity_pool" "github" {
  workload_identity_pool_id = var.pool_id
  display_name              = "GitHub Actions"

  depends_on = [google_project_service.bootstrap]
}

resource "google_iam_workload_identity_pool_provider" "github" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = var.provider_id
  display_name                       = "GitHub OIDC"

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
  }

  # The security boundary: only tokens minted for this repo may exchange.
  attribute_condition = "assertion.repository == \"${var.github_repo}\""

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

resource "google_service_account_iam_member" "wif_impersonation" {
  service_account_id = google_service_account.deployer.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repo}"
}
