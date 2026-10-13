output "state_bucket" {
  description = "GitHub repo variable TF_STATE_BUCKET; also the -backend-config bucket for the infra/ root."
  value       = google_storage_bucket.tfstate.name
}

output "artifact_registry" {
  description = "GitHub repo variable AR_REPO (<region>-docker.pkg.dev/<project>/<repo>)."
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.images.repository_id}"
}

output "deployer_sa_email" {
  description = "GitHub repo variable DEPLOY_SA_EMAIL."
  value       = google_service_account.deployer.email
}

output "wif_provider" {
  description = "GitHub repo variable WIF_PROVIDER (full provider resource name)."
  value       = google_iam_workload_identity_pool_provider.github.name
}

output "budget_name" {
  description = "Resource name of the billing budget guarding monthly spend."
  value       = google_billing_budget.monthly.name
}
