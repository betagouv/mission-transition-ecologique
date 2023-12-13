/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  ignorePatterns: [
    'common/*',
    'programs/*',
    'schemas/*',
    'npm-debug.log',
    '.env',
    '.env.*',
    'tsconfig.json',
    '.vscode/*',
    'README.md',
    'test_files/*',
    'jest.config.cjs',
    '.eslintrc.js'
  ],
}
