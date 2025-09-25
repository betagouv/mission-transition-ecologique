import { ProgramBaserow } from '../common/baserow/programBaserow'
import { ProgramTechnicalInfo } from '../common/baserow/types'
import { ProgramUtils } from './programUtils'
import { DataProgram, MailSenderInterface } from './types/domain'
import { Contact } from '../common/types'
import z from 'zod'
export class MailManager {
  private readonly _mailSender: MailSenderInterface

  constructor(mailSender: MailSenderInterface) {
    this._mailSender = mailSender
  }

  async sendProgramsMails() {
    const programs = await new ProgramBaserow().getPrograms(false)

    for (const program of programs) {
      if (!ProgramUtils.isInProd(program)) {
        continue
      }

      let techInfos = this._parseTechField(program)
      techInfos = this._maybeInitializeMailTechFields(techInfos)
      if (this._isContactValidAndEligible(program.internalContact)) {
        techInfos = await this._maybeSendInitialMail(program, techInfos)
        techInfos = await this._maybeSendEOLMail(program, techInfos)
        techInfos = await this._maybeSendPeriodicMail(program, techInfos)
      }
      await this._maybeUpdateTechInfos(program, techInfos)
    }
  }

  private _parseTechField(program: DataProgram): ProgramTechnicalInfo {
    try {
      return JSON.parse(program.tech) || {}
    } catch {
      return {}
    }
  }

  private _maybeInitializeMailTechFields(techInfos: ProgramTechnicalInfo): ProgramTechnicalInfo {
    if (techInfos.email_enable == null) {
      if (!techInfos.prod_release_date) {
        techInfos.prod_release_date = new Date().toISOString()
      }
      techInfos.email_enable = true
    }
    return techInfos
  }

  private async _maybeSendInitialMail(program: DataProgram, techInfos: ProgramTechnicalInfo): Promise<ProgramTechnicalInfo> {
    if (!techInfos.email_enable) {
      return techInfos
    }

    if (!techInfos.last_mail_sent_date) {
      await this._mailSender.sendInitialMail(program)
      techInfos.last_mail_sent_date = new Date().toISOString()
    }
    return techInfos
  }

  private async _maybeSendPeriodicMail(program: DataProgram, techInfos: ProgramTechnicalInfo): Promise<ProgramTechnicalInfo> {
    if (!techInfos.email_enable || !techInfos.last_mail_sent_date) {
      return techInfos
    }

    const lastSent = new Date(techInfos.last_mail_sent_date)
    const newMailMinDate = new Date(lastSent.getFullYear(), lastSent.getMonth() + 6, lastSent.getDate())

    if (new Date() >= newMailMinDate) {
      await this._mailSender.sendPeriodicMail(program)
      techInfos.last_mail_sent_date = new Date().toISOString()
    }
    return techInfos
  }

  private async _maybeSendEOLMail(program: DataProgram, techInfos: ProgramTechnicalInfo): Promise<ProgramTechnicalInfo> {
    if (!techInfos.email_enable) {
      return techInfos
    }

    const endDate = program.DISPOSITIF_DATE_FIN ? new Date(program.DISPOSITIF_DATE_FIN) : null
    if (!endDate) {
      return techInfos
    }

    // if we already sent an eol mail,
    // check if the end date changed and if we should reset the eol_mail_sent_date
    if (techInfos.eol_mail_sent_date) {
      const mailDate = new Date(techInfos.eol_mail_sent_date)
      const eolMaxDate = new Date(mailDate.getFullYear(), mailDate.getMonth(), mailDate.getDate() + 15)
      if (endDate > eolMaxDate) {
        delete techInfos.eol_mail_sent_date
      }
    }

    const eolMailMinDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 15)
    const today = new Date()

    if (today >= eolMailMinDate && !techInfos.eol_mail_sent_date) {
      await this._mailSender.sendEolMail(program)
      techInfos.eol_mail_sent_date = today.toISOString()
      techInfos.last_mail_sent_date = today.toISOString()
    }

    return techInfos
  }

  private async _maybeUpdateTechInfos(program: DataProgram, techInfos: ProgramTechnicalInfo): Promise<void> {
    const oldTechsInfos = this._parseTechField(program)
    if (
      oldTechsInfos.email_enable != techInfos.email_enable ||
      oldTechsInfos.eol_mail_sent_date != techInfos.eol_mail_sent_date ||
      oldTechsInfos.last_mail_sent_date != techInfos.last_mail_sent_date ||
      oldTechsInfos.prod_release_date != techInfos.prod_release_date
    ) {
      await new ProgramBaserow().patchProgram(program.id, {
        tech: JSON.stringify(techInfos)
      })
      await this._wait()
    }
  }

  private async _wait(ms = 200) {
    return new Promise((res) => setTimeout(res, ms))
  }

  private _isContactValidAndEligible(internalContact: Contact | undefined) {
    if (!internalContact) {
      return false
    }
    if (!z.string().email().safeParse(internalContact.mail).success) {
      return false
    }
    return !internalContact.mail.endsWith('ademe.fr')
  }

  // Code that has been used for the initialization of the "tech" column
  //   interface ProgramCsvRow {
  //   filename: string
  //   date_added: string
  // }
  // async populate_baserow_prod_date() {
  // ##### BASH SCRIPT #####
  // Bash script that, when started in a specific directory
  // return a csv with the date at which each file have been created (not exactly the production date but close in TEE)
  // echo "filename,date_added" > program_creation_date.csv
  // for file in $(git ls-files); do
  // commit=$(git log --follow --diff-filter=A --format="%H" -- "$file" | tail -n 1)
  // if [ -n "$commit" ]; then
  //     date=$(git show -s --format="%ad" --date=iso "$commit")
  //     echo "\"$file\",\"$date\"" >> program_creation_date.csv
  // fi
  // done
  // ##### END BASH SCRIPT #####

  //     const csvPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../static/program_creation_date.csv')
  //     const csvContent = fs.readFileSync(csvPath, 'utf8')

  //     const records = parse<ProgramCsvRow>(csvContent, {
  //       columns: true,
  //       skip_empty_lines: true
  //     })

  //     const programs = await new ProgramBaserow().getPrograms(false)

  //     const baserow = new ProgramBaserow()
  //     for (const record of records) {
  //       const csvKey = record.filename.slice(0, -5)
  //       const mergeDate = record.date_added

  //       const matchingProgram = programs.find((program) => program['Id fiche dispositif'] === csvKey)

  //       if (matchingProgram) {
  //         const updatedTech = {
  //           prod_release_date: mergeDate,
  //           email_enable: false
  //         }

  //         console.log(csvKey, matchingProgram.id, updatedTech)
  //         await baserow.patchProgram(matchingProgram.id, { tech: JSON.stringify(updatedTech) })
  //         await new Promise((resolve) => setTimeout(resolve, 200))

  //         console.log(`✅ Patched program ${csvKey} with merge date ${mergeDate}`)
  //       } else {
  //         console.log(`❌ No match found in Baserow for CSV key: ${csvKey}`)
  //       }
  //     }
  //   }
}
