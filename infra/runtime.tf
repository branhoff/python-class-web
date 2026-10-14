resource "google_service_account" "runtime" {
  account_id   = "${var.service_name}-run"
  display_name = "python-class-web Cloud Run runtime"

  depends_on = [google_project_service.apis]
}

# Firestore is the only thing the app touches; datastore.user is read/write on
# documents with no admin rights.
resource "google_project_iam_member" "runtime_firestore" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.runtime.email}"
}

# OpenTofu owns the whole service definition except the image, which the deploy
# workflow owns (ignore_changes below). No secrets are mounted: Firestore uses
# the service identity and ID-token verification uses Google's public keys.
resource "google_cloud_run_v2_service" "app" {
  name                = var.service_name
  location            = var.region
  deletion_protection = false
  ingress             = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.runtime.email

    scaling {
      min_instance_count = 0
      max_instance_count = var.max_instances
    }

    containers {
      image = var.placeholder_image

      ports {
        container_port = 8080
      }

      env {
        name  = "GCP_PROJECT"
        value = var.project_id
      }

      # Public browser key, not a secret; absent key leaves sign-in off.
      dynamic "env" {
        for_each = var.identity_platform_api_key != "" ? [1] : []
        content {
          name  = "IDENTITY_PLATFORM_API_KEY"
          value = var.identity_platform_api_key
        }
      }
    }
  }

  lifecycle {
    ignore_changes = [template[0].containers[0].image, scaling]
  }

  depends_on = [
    google_project_service.apis,
    google_project_iam_member.runtime_firestore,
  ]
}

# Public invocation: browsers cannot carry a Google identity, so the app's own
# ID-token check is the gate.
resource "google_cloud_run_v2_service_iam_member" "public" {
  name     = google_cloud_run_v2_service.app.name
  location = google_cloud_run_v2_service.app.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
