locals {
  apis = [
    "run.googleapis.com",
    "firestore.googleapis.com",
    "identitytoolkit.googleapis.com",
    "artifactregistry.googleapis.com",
    "iam.googleapis.com",
  ]
}

resource "google_project_service" "apis" {
  for_each = toset(local.apis)

  service            = each.value
  disable_on_destroy = false
}

# Native-mode (default) database. The default database is the one eligible for
# the free tier, and Cloud Run reaches it through its service identity, so there
# is no password or connection string anywhere. Delete protection guards the
# learner data; turn it off deliberately to tear down.
resource "google_firestore_database" "default" {
  name                        = "(default)"
  location_id                 = var.region
  type                        = "FIRESTORE_NATIVE"
  delete_protection_state     = "DELETE_PROTECTION_ENABLED"
  deletion_policy             = "ABANDON"
  app_engine_integration_mode = "DISABLED"

  depends_on = [google_project_service.apis]
}

# Email/password only. Social providers need an OAuth client secret, which would
# land in state; add them out of band (see docs/PLAN.md).
resource "google_identity_platform_config" "default" {
  authorized_domains = var.authorized_domains

  sign_in {
    allow_duplicate_emails = false

    email {
      enabled           = true
      password_required = true
    }
  }

  depends_on = [google_project_service.apis]
}
