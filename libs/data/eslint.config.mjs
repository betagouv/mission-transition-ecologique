import baseConfig from '../../eslint.config.mjs'

export default [
  ...baseConfig,
  {
    ignores: ['**/vite.config.*.timestamp*', '**/vitest.config.*.timestamp*']
  }
]
