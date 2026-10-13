variable "project_id" {
  type        = string
  description = "GCP project ID to bootstrap (must already exist with billing linked)."
}

variable "region" {
  type        = string
  description = "Default region for the state bucket and Artifact Registry."
  default     = "us-west1"
}

variable "github_repo" {
  type        = string
  description = "GitHub repo allowed to impersonate the deployer SA, as owner/name."
  default     = "branhoff/python-class-web"
}

variable "state_bucket_name" {
  type        = string
  description = "Globally-unique name for the GCS bucket holding the infra/ OpenTofu state."
}

variable "ar_repo_name" {
  type        = string
  description = "Artifact Registry Docker repository id."
  default     = "python-class-web"
}

variable "deployer_sa_id" {
  type        = string
  description = "Account id (local part) of the CI deployer service account."
  default     = "python-class-web-deployer"
}

variable "pool_id" {
  type        = string
  description = "Workload Identity Pool id."
  default     = "github-pool"
}

variable "provider_id" {
  type        = string
  description = "Workload Identity Pool provider id."
  default     = "github-provider"
}

variable "billing_account" {
  type        = string
  description = "Billing account id (XXXXXX-XXXXXX-XXXXXX) the budget is created under. Find it with `gcloud billing accounts list`."
}

variable "budget_amount" {
  type        = number
  description = "Monthly budget alerting ceiling, in whole currency units. Everything scales to zero, so the expected floor is about 0."
  default     = 10
}

variable "budget_currency" {
  type        = string
  description = "ISO 4217 currency code for the budget amount; must match the billing account's currency."
  default     = "USD"
}
