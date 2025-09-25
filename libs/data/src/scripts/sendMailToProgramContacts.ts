import BrevoMail from '../common/brevo/brevoMail'
import { MailManager } from '../program/mailManager'

console.log('Start sending mail to Program Contact if needed')

new MailManager(new BrevoMail())
  .sendProgramsMails()
  .then(() => {
    console.log('Program mails sent to contacts')
  })
  .catch((error) => {
    console.error('Error while sending mails to program contacts:', error)
  })
