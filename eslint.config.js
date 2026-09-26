import {
  convertIgnorePatternToMinimatch,
  includeIgnoreFile,
} from '@eslint/compat';
import css from '@eslint/css';
import eslint from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import stylistic from '@stylistic/eslint-plugin';
import {
  importX,
} from 'eslint-plugin-import-x';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import eslintPluginJsonc from 'eslint-plugin-jsonc';
import n from 'eslint-plugin-n';
import {
  configs as packageJsonConfigs,
} from 'eslint-plugin-package-json';
import {
  configs as perfectionistConfigs,
} from 'eslint-plugin-perfectionist';
import promise from 'eslint-plugin-promise';
import {
  configs as regexpConfigs,
} from 'eslint-plugin-regexp';
import {
  configs as tomlConfigs,
} from 'eslint-plugin-toml';
import unicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';
import {
  configs as ymlConfigs,
} from 'eslint-plugin-yml';
import {
  defineConfig,
  globalIgnores,
} from 'eslint/config';
import fs from 'node:fs';
import nodePath from 'node:path';
import {
  fileURLToPath,
} from 'node:url';

/* eslint-disable jsdoc/require-jsdoc -- config helpers are local. */

const here = nodePath.dirname(fileURLToPath(import.meta.url));

// Read a nested .gitignore and anchor every pattern to its directory, so a
// pattern like `sessions/` in .claude/.gitignore becomes `.claude/sessions/`.
const ignoreFromNestedGitignore = (
  gitignorePath,
  baseDirectory,
) => {
  const fullPath = nodePath.join(here, gitignorePath);
  if (!fs.existsSync(fullPath)) {
    return { ignores: [], name: `Skipped missing ${gitignorePath}` };
  }
  const text = fs.readFileSync(fullPath, 'utf8');
  const prefix = baseDirectory.replace(
    /\/?$/u, '/',
  );
  const ignores = text
    .split(/\r?\n/u)
    .map((
      l,
    ) => {
      return l.trim();
    })
    .filter((
      l,
    ) => {
      return l && !l.startsWith('#');
    })
    .map((
      line,
    ) => {
      const negate = line.startsWith('!');
      const pattern = negate ? line.slice(1) : line;
      const anchored = pattern.startsWith('/')
        ? prefix + pattern.slice(1)
        : prefix + '**/' + pattern;
      const converted = convertIgnorePatternToMinimatch(anchored);
      return negate ? '!' + converted : converted;
    });
  return { ignores, name: `Imported ${gitignorePath} patterns` };
};

const jsFiles = ['**/*.js', '**/*.cjs', '**/*.mjs'];
const jsonFiles = ['**/*.json', '**/*.json5', '**/*.jsonc'];
const ymlFiles = ['**/*.yaml', '**/*.yml'];
const tomlFiles = ['**/*.toml'];

// Scope unscoped plugin entries to their target file types
const scopeEntries = (
  entries,
  files,
) => {
  return entries.map((
    entry,
  ) => {
    return entry.files || !entry.rules ? entry : { ...entry, files };
  });
};

/* eslint-enable jsdoc/require-jsdoc */

export default defineConfig([
  {
    extends: [eslint.configs.recommended],
    files: jsFiles,
  },
  {
    files: jsFiles,
    languageOptions: {
      sourceType: 'module',
    },
  },

  {
    extends: ['json/recommended'],
    files: ['**/*.json'],
    ignores: ['package-lock.json', '.vscode/*.json', '.claude/*.json'],
    language: 'json/json',
    plugins: { json },
  },
  {
    files: ['**/*.jsonc', '.vscode/*.json'],
    language: 'json/jsonc',
    plugins: { json },
    rules: { 'json/no-duplicate-keys': 'error' },
  },
  {
    files: ['.claude/*.json'],
    language: 'json/json5',
    plugins: { json },
    rules: { 'json/no-duplicate-keys': 'error' },
  },
  ...scopeEntries(
    eslintPluginJsonc.configs['flat/recommended-with-jsonc'],
    jsonFiles,
  ),

  {
    extends: ['markdown/recommended'],
    files: ['**/README.md', '**/AGENTS.md', '**/SKILL.md', '**/*.guide.md'],
    language: 'markdown/gfm',
    plugins: { markdown },
  },

  {
    extends: ['css/recommended'],
    files: ['**/*.css'],
    language: 'css/css',
    plugins: { css },
  },

  {
    extends: [importX.flatConfigs.recommended],
    files: jsFiles,
    rules: {
      // Disabled: the single slowest rule. It re-walks the module graph for
      // every `import * as X from 'y'` to verify `X.foo` is a real export.
      'import-x/namespace': 'off',
      // Disabled: `n/no-missing-import` already reports an unresolvable
      // specifier, so this would duplicate the report.
      'import-x/no-unresolved': 'off',
    },
  },

  {
    files: jsFiles,
    plugins: { 'unused-imports': unusedImports },
    rules: {
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  {
    extends: [
      unicorn.configs.recommended,
      promise.configs['flat/recommended'],
      regexpConfigs['flat/recommended'],
      n.configs['flat/recommended'],
      perfectionistConfigs['recommended-natural'],
    ],
    files: jsFiles,
    rules: {
      'perfectionist/sort-interfaces': 'off',
      'perfectionist/sort-modules': 'off',
      'perfectionist/sort-object-types': 'off',
      'perfectionist/sort-objects': 'off',
      'unicorn/prevent-abbreviations': ['error', {
        allowList: { dir: true, str: true, tmp: true },
        replacements: { props: false },
      }],
    },
  },

  ...scopeEntries(
    ymlConfigs['flat/recommended'], ymlFiles,
  ),
  ...scopeEntries(
    tomlConfigs.recommended, tomlFiles,
  ),
  packageJsonConfigs.recommended,

  {
    extends: [jsdocPlugin.configs['flat/recommended-error']],
    files: jsFiles,
  },
  {
    files: jsFiles,
    rules: {
      'jsdoc/require-jsdoc': ['error', {
        contexts: [
          'Program > VariableDeclaration',
          'ExportNamedDeclaration:has(VariableDeclaration)',
        ],
        require: {
          ClassDeclaration: true,
          FunctionDeclaration: true,
          MethodDefinition: true,
        },
      }],
    },
  },

  {
    files: jsFiles,
    rules: {
      'arrow-body-style': ['error', 'always'],
      'eqeqeq': ['error', 'always', { null: 'never' }],
      'func-style': ['error', 'expression'],
      'no-undefined': 'error',
      'prefer-arrow-callback': 'error',
      'unicorn/no-null': 'off',
    },
  },

  {
    extends: [stylistic.configs.recommended],
    files: jsFiles,
  },
  {
    files: jsFiles,
    rules: {
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/function-paren-newline': ['error', 'consistent'],
      '@stylistic/max-len': ['error', { code: 200, ignoreUrls: true }],
      '@stylistic/member-delimiter-style': ['error', {
        multiline: { delimiter: 'semi', requireLast: true },
        singleline: { delimiter: 'semi', requireLast: false },
      }],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
    },
  },

  includeIgnoreFile(nodePath.join(
    here, '.gitignore',
  )),
  ignoreFromNestedGitignore(
    '.claude/.gitignore', '.claude',
  ),
  globalIgnores([
    // 3rd-party plugin marketplace content
    '.claude/plugins/marketplaces/**',
    // pnpm lockfile and workspace config; not source.
    'pnpm-*.yaml',
  ]),
]);
