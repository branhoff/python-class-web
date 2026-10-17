variable "project_id" {
  type        = string
  description = "GCP project ID (same one bootstrapped)."
}

variable "region" {
  type        = string
  description = "Region for Cloud Run and Firestore."
  default     = "us-west1"
}

variable "service_name" {
  type        = string
  description = "Cloud Run service name."
  default     = "python-class-web"
}

variable "placeholder_image" {
  type        = string
  description = "Image the service is created with before the first real deploy swaps it in."
  default     = "us-docker.pkg.dev/cloudrun/container/hello"
}

variable "max_instances" {
  type        = number
  description = "Cloud Run max instances; caps cost and concurrency for the cohort POC."
  default     = 2
}

variable "authorized_domains" {
  type        = list(string)
  description = "Domains allowed to host Identity Platform sign-in."
  default     = ["localhost", "python-class-web-250740822837.us-west1.run.app"]
}

variable "custom_domain" {
  type        = string
  description = "Domain that serves the site, for example understandit.dev. Empty leaves the site on its run.app address. Needs a Cloud DNS zone (dns_zone_name) for the domain. Set via the CUSTOM_DOMAIN repo variable."
  default     = ""
}

variable "dns_zone_name" {
  type        = string
  description = "Name of the Cloud DNS managed zone that holds the records for custom_domain. Created with the domain registration, outside OpenTofu."
  default     = "understandit-dev"
}

variable "alert_email" {
  type        = string
  description = "Address that receives uptime and error alerts. Empty turns the monitoring resources off. Set via the ALERT_EMAIL repo variable."
  default     = ""
}

variable "csp_enforce" {
  type        = bool
  description = "Send the Content-Security-Policy as an enforcing header instead of report-only. Turn on after production has been watched with the browser console open."
  default     = false
}

variable "identity_platform_api_key" {
  type        = string
  description = "Public Identity Platform browser API key, served to the client for sign-in. Not a secret (it ships to browsers by design); empty leaves sign-in off. Set via the IDENTITY_PLATFORM_API_KEY repo variable."
  default     = ""
}
