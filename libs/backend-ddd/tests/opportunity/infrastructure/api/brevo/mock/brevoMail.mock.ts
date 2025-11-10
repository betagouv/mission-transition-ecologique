import { Maybe } from 'true-myth'
import { MailerManager } from '../../../../../../src/opportunity/domain/spi'

export default class BrevoMailMock {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  sendReturnReceipt: MailerManager['sendReturnReceipt'] = async (): Promise<Maybe<Error> | void> => {}
}
