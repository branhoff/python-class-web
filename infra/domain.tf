# Serves the site on its own domain. Cloud Run domain mappings are in preview and
# Google does not call them production-ready; they are free, and the fallback is a
# load balancer (see infra/README.md). Skipped when custom_domain is empty.
locals {
  custom_domain_enabled = var.custom_domain != ""
  authorized_domains    = distinct(concat(var.authorized_domains, local.custom_domain_enabled ? [var.custom_domain] : []))
  address_record_types  = local.custom_domain_enabled ? toset(["A", "AAAA"]) : toset([])
}

resource "google_cloud_run_domain_mapping" "site" {
  count = local.custom_domain_enabled ? 1 : 0

  location = var.region
  name     = var.custom_domain

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_v2_service.app.name
  }

  depends_on = [google_project_service.apis]
}

data "google_dns_managed_zone" "site" {
  count = local.custom_domain_enabled ? 1 : 0

  name = var.dns_zone_name
}

# The addresses come from the mapping, so they stay right if Google changes them.
resource "google_dns_record_set" "site" {
  for_each = local.address_record_types

  managed_zone = data.google_dns_managed_zone.site[0].name
  name         = data.google_dns_managed_zone.site[0].dns_name
  type         = each.value
  ttl          = 300
  rrdatas = [
    for record in google_cloud_run_domain_mapping.site[0].status[0].resource_records :
    record.rrdata if record.type == each.value
  ]
}
