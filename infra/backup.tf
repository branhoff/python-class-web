# A daily backup of the learner data, kept for four weeks. Point-in-time recovery
# (main.tf) covers the last week to the minute; these cover older mistakes.
# Backups are stored in the database's region and billed by storage, which is tiny
# for an append-only progress log.
resource "google_firestore_backup_schedule" "daily" {
  database  = google_firestore_database.default.name
  retention = "2419200s" # 28 days

  daily_recurrence {}
}
