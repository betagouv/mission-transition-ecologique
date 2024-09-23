import { FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  global.productionUrl = 'https://mission-transition-ecologique.beta.gouv.fr/'
  global.testUrl = 'http://localhost:4242/'
}

export default globalSetup
