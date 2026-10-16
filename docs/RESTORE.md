# Restoring the learner data

Learner progress lives in the Firestore `(default)` database of the
`python-class-web-prod` project. This is the runbook for getting data back after
a bad deploy that wrote wrong data, or documents that were deleted by mistake.

Read this once before you need it. Try a practice restore (step 4) after any
change to the backup setup, so the first time is not during an incident.

## What exists

- **Point-in-time recovery:** the last 7 days, to the minute. Enabled in
  `infra/main.tf`. History starts when it was turned on.
- **Daily backup:** one a day, kept 28 days. Defined in `infra/backup.tf`.
- **Delete protection** on the database, so it cannot be dropped by accident.

Every restore creates a **new** database. It never overwrites `(default)`.

## 1. Decide what you need

| Situation                                                    | Use                                                            |
| ------------------------------------------------------------ | -------------------------------------------------------------- |
| The mistake was in the last 7 days and you know roughly when | point-in-time (`clone`)                                        |
| It was longer ago, or you do not know when                   | a daily backup (`restore`)                                     |
| You only need one learner's records back                     | restore to a scratch database and copy those documents by hand |

Stop the damage first: if a bad deploy is still writing wrong data, roll back the
service before restoring (redeploy an earlier commit with the Deploy workflow).

## 2. Restore into a scratch database

Use a new name each time. The database must not already exist. Always pass
`--project`: a `gcloud` default project may be a different one.

From a point in time (a whole minute, in the past, within 7 days, in UTC):

```sh
gcloud firestore databases clone \
  --source-database=projects/python-class-web-prod/databases/'(default)' \
  --snapshot-time=2026-10-15T23:45:00Z \
  --destination-database=restore-check \
  --project python-class-web-prod
```

From a backup:

```sh
gcloud firestore backups list --project python-class-web-prod
gcloud firestore databases restore \
  --source-backup=projects/python-class-web-prod/locations/us-west1/backups/BACKUP_ID \
  --destination-database=restore-check \
  --project python-class-web-prod
```

A restore can take several minutes. If `gcloud` does not recognise a command or
flag, run it with `--help` (or update with `gcloud components update`) and fix
this page: the commands were written without being able to test them.

## 3. Check the copy

Open the Firestore page of the console for `python-class-web-prod`, switch to
`restore-check`, and look at the `users` collection. Open a few learners'
`events` and confirm the records are there up to the time you chose.

## 4. Get the data back into the live app

**This is the weak spot.** The app reads only the `(default)` database; there is
no setting for a different database id (`src/repository/firestore.ts`). So a
restored copy cannot be switched in by a redeploy. Until that is fixed (see
below), the options are:

1. **Copy documents back by hand.** Fine for one learner or a handful of
   documents: read them from `restore-check` and write them into `(default)`.
2. **Export and import.** Export `restore-check` to a Cloud Storage bucket with
   `gcloud firestore export`, then import into `(default)` with
   `gcloud firestore import`. An import writes documents back by id and does not
   delete extra documents that are in `(default)`. This needs a bucket and the
   right roles for the person running it, and has not been tried here.
3. **Replace `(default)`.** Only for a total loss: turn off delete protection in
   `infra/main.tf`, apply, delete `(default)`, restore a backup into a database
   named `(default)`, turn protection back on. Untested, and it fights the
   OpenTofu state, so do not start it without reading the provider docs first.

The tracked fix is to make the database id configurable so recovery is "restore
to a new database, set the id, redeploy". That is issue #103.

## 5. Clean up

Delete the scratch database when you are done:

```sh
gcloud firestore databases delete --database=restore-check --project python-class-web-prod
```

## Practice restore log

Add a line each time you try a restore.

| Date | Method | Result |
| ---- | ------ | ------ |
|      |        |        |

## Cost and learner data

Recovery history and backups are billed by storage, which is cents a month at
this size. A learner's data stays in backups for up to 28 days after it is
deleted, which matters if account deletion (#60) lands.
