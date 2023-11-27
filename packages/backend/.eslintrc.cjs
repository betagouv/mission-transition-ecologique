/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  ignorePatterns: [
    'build/*',
    'generated/*',
    'images/*',
    'npm-debug.log',
    '.env',
    '.env.*',
    'tsconfig.json',
    '.vscode/*',
    'README.md',
    'tsoa.json',
    'jest.config.cjs',
    'nodemon.json',
  ],
}
