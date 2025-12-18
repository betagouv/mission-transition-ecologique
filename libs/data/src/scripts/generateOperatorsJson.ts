import path from 'path'
import { fileURLToPath } from 'url'
import { ImageBaserow } from '../common/baserow/imageBaserow'
import { Logger } from '../common/logger/logger'
import { LoggerType } from '../common/logger/types'
import { OperatorFeatures } from '../operators/operatorFeatures'

console.log('Start the Operator generation')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const logger = new Logger(LoggerType.Operator)
const logoOperatorDir = '/images/logos/operateur/'

const imageDownloader = new ImageBaserow(
  path.join(__dirname, '../../../../apps/nuxt/src/public' + logoOperatorDir),
  path.join(__dirname, '../../static/operator_images_download_info.json'),
  100,
  logoOperatorDir
)

new OperatorFeatures(imageDownloader, logger).updateOperatorsData().catch((error) => {
  console.error('Error during the Operator Json generation:', error)
})

logger.write('generateOperatorsJson.log')
