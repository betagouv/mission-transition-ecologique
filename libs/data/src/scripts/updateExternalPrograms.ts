import { AdemeDataManager } from '../externalProgram/ademe/ademeDataManager'

const main = async () => {
  const ademeDataManager = new AdemeDataManager()
  await ademeDataManager.updateData()
}

main()
  .then(() => {
    console.log('External data update completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('External data update failed:', error)
    process.exit(1)
  })
