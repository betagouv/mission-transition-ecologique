import { Maybe } from 'true-myth'
import { MailerManager } from '../../../../domain/spi'

export default class BrevoMailTest {
  sendReturnReceipt: MailerManager['sendReturnReceipt'] = async (): Promise<Maybe<Error> | void> => {
    console.log('send email')
  }
}
