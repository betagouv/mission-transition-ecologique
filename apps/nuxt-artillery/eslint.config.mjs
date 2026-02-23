import baseConfig from '../../eslint.config.mjs'
import playwright from 'eslint-plugin-playwright'

export default [
  ...baseConfig,
  {
    ...playwright.configs['flat/recommended'],
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx']
  },
  {
    files: ['src/**/*.{ts,js,tsx,jsx}'],
    rules: {
      'playwright/no-networkidle': 'warn'
    }
  }
]
