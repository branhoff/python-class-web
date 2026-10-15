# A billing budget lives on the billing account, so it is here in bootstrap (run
# locally under credentials with billing admin) rather than in the CI-run infra/
# root; that keeps the deployer SA free of any billing-account role.
resource "google_project_service" "budgets" {
  service            = "billingbudgets.googleapis.com"
  disable_on_destroy = false
}

data "google_project" "this" {
  project_id = var.project_id
}

# The infra/ root has its own channel for the same address; the two roots do not
# share state, so each owns the channel it uses.
resource "google_monitoring_notification_channel" "budget_email" {
  count = var.alert_email != "" ? 1 : 0

  display_name = "python-class-web budget alerts"
  type         = "email"

  labels = {
    email_address = var.alert_email
  }

  depends_on = [google_project_service.bootstrap]
}

resource "google_billing_budget" "monthly" {
  billing_account = var.billing_account
  display_name    = "${var.project_id} monthly budget"

  budget_filter {
    projects = ["projects/${data.google_project.this.number}"]
  }

  amount {
    specified_amount {
      currency_code = var.budget_currency
      units         = tostring(var.budget_amount)
    }
  }

  dynamic "threshold_rules" {
    for_each = [0.5, 0.9, 1.0]
    content {
      threshold_percent = threshold_rules.value
      spend_basis       = "CURRENT_SPEND"
    }
  }

  threshold_rules {
    threshold_percent = 1.0
    spend_basis       = "FORECASTED_SPEND"
  }

  dynamic "all_updates_rule" {
    for_each = google_monitoring_notification_channel.budget_email
    content {
      monitoring_notification_channels = [all_updates_rule.value.id]
    }
  }

  depends_on = [google_project_service.budgets]
}
