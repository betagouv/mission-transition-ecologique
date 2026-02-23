import { ProgramExport } from '../programExport/programExport'

console.log('▶ Starting the conversion from Baserow to the "dispositif aide" format and CSV export\n')

new ProgramExport()
  .exportAsCsv()
  .then(() => {
    console.log('CSV export generated')
  })
  .catch((error) => {
    console.error('Error during the process:', error)
  })
