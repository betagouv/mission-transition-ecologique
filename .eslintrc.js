/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended-type-checked', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json', './packages/*/tsconfig.*.json']
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: { multiline: true, minProperties: 1 },
        ObjectPattern: { multiline: true },
        ImportDeclaration: { multiline: true, minProperties: 3 },
        ExportDeclaration: { multiline: true, minProperties: 3 }
      }
    ]
  },
  ignorePatterns: ['.idea/*', 'README.md', 'start.sh', '.github/*', '.eslintrc.js']
}
