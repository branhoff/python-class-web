# Mutation testing

`make mutation` mutates the source (`stryker.config.json`) and checks that a test
fails for each change. A mutant that survives means a missing assertion, except
when the change cannot alter behavior. This page records the survivors that are
known to be equivalent, so nobody chases them with a brittle test.

Run one file while working, which takes about a minute:

```sh
npm run mutation:sandbox -- --mutate src/lessons/nav.ts
```

(`mutation:sandbox` is for shells that cannot bind a socket; in a normal terminal
use `npx stryker run --mutate ...`.) The full run takes about 45 minutes locally,
so CI runs it on demand: Actions, Mutation, Run workflow. The break threshold is
90%.

A run that is slow can time out mutants, and Stryker counts a timeout as detected.
If a score looks too good, re-run that file on its own.

## Known equivalent survivors

None of these can change what the program does, so no test can tell them apart.

| Where                                             | Mutation                               | Why it is equivalent                                                                           |
| ------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `load.ts`, `readdirSync(... encoding: 'utf8')`    | `encoding: ''`                         | Node reads an empty encoding as utf8. TypeScript needs the explicit value for the return type. |
| `nav.ts`, `progressItemIds`                       | `block.type === 'cell'` becomes `true` | Only cells have a `kind`, so the check is for the compiler's type narrowing.                   |
| `render.ts`, `hasChecks`                          | `block.type === 'cell'` becomes `true` | Same as `nav.ts`: only cells have a `kind`, so the check is for the compiler's type narrowing. |
| `parse-cell.ts`, the main loop                    | `i < body.length` becomes `<=`         | One extra pass reads `undefined`, which is not a fence and adds nothing.                       |
| `parse-cell.ts`, `findIndex`                      | `j > i` becomes `j >= i`               | A bare opening fence is added to the prompt unchanged either way.                              |
| `parse-cell.ts`, `words[1] ?? ''`                 | the fallback text                      | The role is only read when there are two words.                                                |
| `parse.ts`, `findCellEnd` and `parseLesson` loops | `<` becomes `<=`                       | One extra pass reads `undefined`, which matches nothing.                                       |
| `render.ts`, `lang ?? ''`                         | the fallback text                      | `marked` always passes a string, `''` for a bare fence. The type is optional.                  |
| `site.ts`, `readFileSync(..., 'utf8')`            | `''`                                   | A Buffer serves the same bytes as the string.                                                  |
| `site.ts`, `app.get('/')`                         | `''`                                   | Hono treats an empty path and `/` alike.                                                       |
| `site.ts`, the static path rewrite                | drops the `^`                          | The route only matches paths that start with `/static`.                                        |
| `app.ts`, `.catch(() => null)`                    | `() => undefined`                      | The `??` below handles both.                                                                   |
| `dev-identity.ts`, `KEY_ID`                       | `''`                                   | Any id works if the key and the token header agree.                                            |
| `dev-identity.ts`, the non-text email fallback    | the fallback text                      | Any non-email fails the same validation.                                                       |
| `identity-platform.ts`, the missing-token guard   | removed                                | `jwtVerify` also rejects a missing token; the guard only skips the work.                       |

When a file changes enough that a row no longer matches, delete the row.
