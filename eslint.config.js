// Flat ESLint config. habit-hooks' TypeScript plugin uses THIS file if present,
// so these rules are the single source of truth for both `npm run lint` and
// habit-hooks' coaching layer.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

const DATASTORE_SDKS = ['@google-cloud/firestore', 'firebase-admin', 'firebase-admin/*', 'pg'];

export default tseslint.config(
  { ignores: ['node_modules/', 'dist/', 'build/', 'reports/', '.stryker-tmp/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // AGENTS.md rule 11: datastore SDKs are confined to their repository
    // implementation so callers can never depend on them.
    files: ['**/*.ts'],
    ignores: ['src/repository/firestore.ts', 'src/repository/postgres.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: DATASTORE_SDKS.map((name) => ({
            name,
            message: 'Datastore SDKs may only be imported inside src/repository/<backend>.ts.',
          })),
          patterns: [{ group: DATASTORE_SDKS.filter((n) => n.endsWith('/*')) }],
        },
      ],
    },
  },
  prettier,
);
