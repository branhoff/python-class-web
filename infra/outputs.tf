output "service_url" {
  description = "Public HTTPS URL of the Cloud Run service."
  value       = google_cloud_run_v2_service.app.uri
}

output "runtime_sa_email" {
  description = "Service account the Cloud Run service runs as."
  value       = google_service_account.runtime.email
}

output "site_url" {
  description = "Address learners use: the custom domain when one is set, otherwise the run.app address."
  value       = local.custom_domain_enabled ? "https://${var.custom_domain}" : google_cloud_run_v2_service.app.uri
}
