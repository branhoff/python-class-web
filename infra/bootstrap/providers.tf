terraform {
  required_version = ">= 1.6"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }

  # Local state on purpose: bootstrap creates the bucket that the live infra/
  # root stores its state in, so it cannot use that backend itself. Keep
  # terraform.tfstate (git-ignored) somewhere safe; losing it only means
  # re-importing the handful of seed resources.
}

provider "google" {
  project = var.project_id
  region  = var.region

  # The Billing Budgets API is quota'd against a project, which user ADC does not
  # set by default; the override bills quota to this project instead.
  billing_project       = var.project_id
  user_project_override = true
}
