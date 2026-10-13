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
  description = "Domains allowed to host Identity Platform sign-in. Add the Cloud Run or custom domain once known."
  default     = ["localhost"]
}
