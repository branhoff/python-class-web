# Uptime check and alerts. Everything here is skipped when alert_email is empty,
# so an unconfigured environment still plans and applies.
locals {
  alerts_enabled = var.alert_email != ""
}

resource "google_monitoring_notification_channel" "email" {
  count = local.alerts_enabled ? 1 : 0

  display_name = "python-class-web alerts"
  type         = "email"

  labels = {
    email_address = var.alert_email
  }

  depends_on = [google_project_service.apis]
}

# /health is public by design and returns no data. Monitoring requires at least
# three regions and allows a check at most every 15 minutes; this is the lightest
# setting.
resource "google_monitoring_uptime_check_config" "health" {
  count = local.alerts_enabled ? 1 : 0

  display_name = "python-class-web /health"
  period       = "900s"
  timeout      = "10s"

  http_check {
    path           = "/health"
    port           = 443
    use_ssl        = true
    validate_ssl   = true
    request_method = "GET"
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.project_id
      host       = trimprefix(google_cloud_run_v2_service.app.uri, "https://")
    }
  }

  selected_regions = ["USA_OREGON", "USA_IOWA", "USA_VIRGINIA"]

  depends_on = [google_project_service.apis]
}

# Fires when more than one of the three regions fails, so one regional blip does
# not send an email.
resource "google_monitoring_alert_policy" "down" {
  count = local.alerts_enabled ? 1 : 0

  display_name = "python-class-web is down"
  combiner     = "OR"

  conditions {
    display_name = "/health failing from more than one region"

    condition_threshold {
      filter = join(" AND ", [
        "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\"",
        "metric.labels.check_id=\"${google_monitoring_uptime_check_config.health[0].uptime_check_id}\"",
        "resource.type=\"uptime_url\"",
      ])
      duration        = "60s"
      comparison      = "COMPARISON_GT"
      threshold_value = 1

      aggregations {
        alignment_period     = "900s"
        per_series_aligner   = "ALIGN_NEXT_OLDER"
        cross_series_reducer = "REDUCE_COUNT_FALSE"
        group_by_fields      = ["resource.label.*"]
      }
    }
  }

  notification_channels = [google_monitoring_notification_channel.email[0].name]

  documentation {
    mime_type = "text/markdown"
    content   = "The /health check is failing from more than one region. Check the Cloud Run service `${var.service_name}` and its recent revisions."
  }
}

# A burst of server errors with the site still answering /health, for example
# sign-in or the database failing.
resource "google_monitoring_alert_policy" "server_errors" {
  count = local.alerts_enabled ? 1 : 0

  display_name = "python-class-web server errors"
  combiner     = "OR"

  conditions {
    display_name = "more than 5 server errors in 5 minutes"

    condition_threshold {
      filter = join(" AND ", [
        "metric.type=\"run.googleapis.com/request_count\"",
        "resource.type=\"cloud_run_revision\"",
        "resource.labels.service_name=\"${var.service_name}\"",
        "metric.labels.response_code_class=\"5xx\"",
      ])
      duration        = "0s"
      comparison      = "COMPARISON_GT"
      threshold_value = 5

      aggregations {
        alignment_period     = "300s"
        per_series_aligner   = "ALIGN_SUM"
        cross_series_reducer = "REDUCE_SUM"
      }
    }
  }

  notification_channels = [google_monitoring_notification_channel.email[0].name]

  documentation {
    mime_type = "text/markdown"
    content   = "The service returned more than 5 server errors in 5 minutes. Check the Cloud Run logs for `${var.service_name}`."
  }
}
