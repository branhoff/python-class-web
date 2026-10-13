# Security policy

## Reporting a vulnerability

Do not open a public issue. Report privately to `<SECURITY_CONTACT>` (or use
GitHub's "Report a vulnerability" under the Security tab) with reproduction
steps and the affected version. Expect an acknowledgement within
`<RESPONSE_TIME>`.

## Secrets

Never commit credentials. `make secrets` (gitleaks) runs in the pre-commit hook
and in CI. If a secret is committed, rotate it first — rewriting history does
not un-leak it.
