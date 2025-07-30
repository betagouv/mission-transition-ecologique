import path from 'path'
import { ProgramBaserow } from '../common/baserow/programBaserow'
import fs from 'fs'
import { parse } from 'csv-parse/sync'
import { fileURLToPath } from 'url'

interface ProgramCsvRow {
  filename: string
  date_added: string
}

export class MailManager {
  async sendProgramsMails() {
    const programs = await new ProgramBaserow().getPrograms(false)
  }

  async populate_baserow_prod_date() {
    const csvPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../static/program_main_merge_date.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf8')

    const records = parse<ProgramCsvRow>(csvContent, {
      columns: true,
      skip_empty_lines: true
    })

    const programs = await new ProgramBaserow().getPrograms(false)

    const baserow = new ProgramBaserow()
    for (const record of records) {
      const csvKey = record.filename.slice(0, -5)
      const mergeDate = record.date_added

      const matchingProgram = programs.find((program) => program['Id fiche dispositif'] === csvKey)

      if (matchingProgram) {
        const updatedTech = {
          prod_release_date: mergeDate
        }

        console.log(csvKey, matchingProgram.id, updatedTech)
        await baserow.patchProgram(matchingProgram.id, { tech: JSON.stringify(updatedTech) })
        await new Promise((resolve) => setTimeout(resolve, 200))

        console.log(`✅ Patched program ${csvKey} with merge date ${mergeDate}`)
      } else {
        console.log(`❌ No match found in Baserow for CSV key: ${csvKey}`)
      }
    }
  }
}
