terraform {
  required_version = ">= 1.6"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }

  # Bucket is injected at init time from the bootstrap output:
  #   tofu init -backend-config="bucket=$TF_STATE_BUCKET"
  backend "gcs" {
    prefix = "python-class-web/infra"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region

  # Identity Platform's API is quota'd against a project; bill it to this one.
  billing_project       = var.project_id
  user_project_override = true
}
