import { Maybe } from 'true-myth'
import { MailerManager } from '../../../../../../src/opportunity/domain/spi'

export default class BrevoMailMock {
  sendReturnReceipt: MailerManager['sendReturnReceipt'] = async (): Promise<Maybe<Error> | void> => {}
}
