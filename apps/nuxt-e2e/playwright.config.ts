import { ConfigOptions } from '@nuxt/test-utils/playwright'
import { defineConfig, devices } from '@playwright/test'
import { nxE2EPreset } from '@nx/playwright/preset'
import { fileURLToPath } from 'node:url'
import { timeOut } from './src/config'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

// export const setupNuxt = (options?: Partial<TestOptions>) => {
//   return setup({
//     build: false,
//     buildDir: '../nuxt/.output',
//     nuxtConfig: {
//       nitro: {
//         output: {
//           dir: '../nuxt/.output'
//         }
//       }
//     },
//     ...options
//   })
// }

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<ConfigOptions>({
  use: {
    baseURL: 'http://localhost:4242',
    trace: 'on-first-retry',
    nuxt: {
      rootDir: fileURLToPath(new URL('../nuxt', import.meta.url)),
      host: 'http://localhost:4242'
    }
  },
  // use: {
  //   baseURL: 'http://localhost:4243',
  //
  //   /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
  //   trace: 'on-first-retry'
  // },
  ...nxE2EPreset(fileURLToPath(import.meta.url), { testDir: './src' }),
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  /* Run your local dev server before starting the tests */
  timeout: timeOut * 2,
  webServer: {
    timeout: 120000,
    env: {
      VITE_DATA_TEST: 'true',
      THIRD_PARTY_API_ENABLED: 'false',
      PORT: '4242'
    },
    command: 'npm run build:start',
    url: 'http://localhost:4242',
    reuseExistingServer: !process.env.CI
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] }
    // },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    }
  ]
})
