import nxPlugin from '@nx/eslint-plugin'
import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'

export default tseslint.config(
  { ignores: ['**/node_modules', '**/dist', '**/.nuxt', '**/.output'] },
  {
    plugins: {
      '@nx': nxPlugin,
      prettier: prettierPlugin,
      'unused-imports': unusedImportsPlugin
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [{ sourceTag: '*', onlyDependOnLibsWithTags: ['*'] }]
        }
      ]
    }
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx', '**/*.mts']
  })),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['enum', 'class'],
          format: ['PascalCase'],
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid'
        },
        {
          selector: 'memberLike',
          modifiers: ['private'],
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'require'
        }
      ],
      curly: ['error', 'all']
    }
  },
  {
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'none'
        }
      ],
      curly: ['error', 'all']
    }
  }
)
