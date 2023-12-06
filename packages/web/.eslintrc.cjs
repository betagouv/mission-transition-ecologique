/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  parser: 'vue-eslint-parser',
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
  ],
  overrides: [
    {
      files: [
        'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'
      ],
      extends: [
        'plugin:cypress/recommended'
      ]
    }
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
  },
  exclude: [
    '../backend/src/domain/eligibility.ts',
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
  ignorePatterns: [
    'dist/*',
    'coverage/*',
    'images/*',
    'npm-debug.log',
    '.env',
    '.env.*',
    'tsconfig.json',
    '.vscode/*',
    'README.md',
    'index.html',
    '.eslintrc.cjs',
  ],
}
