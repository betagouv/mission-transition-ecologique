import path from 'path'
import { ProgramBaserow } from '../common/baserow/programBaserow'
import fs from 'fs'
import { parse } from 'csv-parse/sync'
import { fileURLToPath } from 'url'
import { ProgramTechField } from '../common/baserow/types'
import { ProgramUtils } from './programUtils'
import { jsonPrograms } from '../../static'

interface ProgramCsvRow {
  filename: string
  date_added: string
}

export class MailManager {
  async sendProgramsMails() {
    const baserow = new ProgramBaserow()
    const programs = await baserow.getPrograms(false)

    const today = new Date()
    const prodCutoffDate = new Date('2025-08-01')

    for (const program of programs) {
      if (!ProgramUtils.isInProd(program)) {
        continue
      }
      const programRowId = program.id
      const tech: ProgramTechField = JSON.parse(program.tech) || {}

      const prodDate = tech.prod_release_date ? new Date(tech.prod_release_date) : null
      if (!prodDate || prodDate < prodCutoffDate) {
        continue
      }

      let techChanged = false

      if (!tech.last_mail_sent_date) {
        // await brevo.sendInitialMail(program)
        tech.last_mail_sent_date = today.toISOString()
        techChanged = true
        console.log(`📩 Sent initial mail for program ${programRowId}`)
      } else {
        const lastSent = new Date(tech.last_mail_sent_date)
        const newMailMinDate = new Date(lastSent.getFullYear(), lastSent.getMonth() + 6, lastSent.getDate())
        if (today >= newMailMinDate && !tech.eol_mail_sent_date) {
          // await brevo.sendPeriodicMail(program)
          tech.last_mail_sent_date = today.toISOString()
          techChanged = true
          console.log(`📩 Sent periodic mail for program ${programRowId}`)
        }
      }

      const endDate = program.DISPOSITIF_DATE_FIN ? new Date(program.DISPOSITIF_DATE_FIN) : null
      if (endDate) {
        const eolMailMinDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 15)

        if (today >= eolMailMinDate && !tech.eol_mail_sent_date) {
          // await brevo.sendEolMail(program)
          tech.eol_mail_sent_date = today.toISOString()
          techChanged = true
          console.log(`📩 Sent EOL mail for program ${programRowId}`)
        }

        const todayPlus15Days = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15)
        if (tech.eol_mail_sent_date && endDate > todayPlus15Days) {
          // if the eol date changed, the eol mail sent is not relevant anymore
          delete tech.eol_mail_sent_date
          techChanged = true
          console.log(`🧼 Cleared EOL mail flag for program ${programRowId} (end_date moved)`)
        }
      }

      if (techChanged) {
        // await baserow.patchProgram(program.id, {
        //   tech: JSON.stringify(tech)
        // })
        console.log(`✅ Patched tech field for program ${programRowId}`)
        await new Promise((res) => setTimeout(res, 200)) // Wait 0.2s between requeststo avoid hitting API limits
      }
    }
  }

  async populate_baserow_prod_date() {
    //
    // Ajouter Commande bash/git pour sortir le csv
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
          prod_release_date: mergeDate,
          email_enable: false
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

  async populateFutureProdDates() {
    const baserow = new ProgramBaserow()
    const programs = await baserow.getPrograms(false)

    const today = new Date().toISOString()

    // lire les entrées json;
    // CHECK si program.tech est vide plutot que de cast avec un || {}

    for (const program of programs) {
      const programKey = program['Id fiche dispositif']
      const tech: ProgramTechField = JSON.parse(program.tech) || {}

      if (tech.prod_release_date) {
        continue
      }

      const matchingJson = jsonPrograms.find((p) => p.id === programKey)
      if (matchingJson) {
        tech.prod_release_date = today
        tech.email_enable = true

        // await baserow.patchProgram(program.id, {
        //   tech: JSON.stringify(tech),
        // })

        console.log(`✅ Set prod_release_date for program ${programKey}`)
        await new Promise((res) => setTimeout(res, 200))
      }
    }
  }
}
