import { DataProgram, Status } from '../../src/program/types/domain'
export interface MailManagerTestCase {
  name: string
  testData: Partial<Pick<DataProgram, 'tech' | 'Statuts' | 'DISPOSITIF_DATE_DEBUT' | 'DISPOSITIF_DATE_FIN' | 'internalContact'>>
  expected: {
    sendInitialMail: boolean
    sendPeriodicMail: boolean
    sendEolMail: boolean
  }
}

// Test date is set in the mailManager.test.ts file at the 1st of june 2025.
export const mailManagerTestCases: MailManagerTestCase[] = [
  {
    name: 'initial mail should be sent if there is no data in the tech field',
    testData: {
      tech: JSON.stringify({}),
      DISPOSITIF_DATE_DEBUT: '2024-01-01',
      DISPOSITIF_DATE_FIN: '2026-12-31',
      Statuts: [Status.InProd],
      internalContact: { id: 1, name: 'test', mail: 'test@test.com' }
    },
    expected: {
      sendInitialMail: true,
      sendPeriodicMail: false,
      sendEolMail: false
    }
  },
  {
    name: 'no mail should be sent if the status is Not in prod or inProdNotAvailable',
    testData: {
      tech: JSON.stringify({}),
      DISPOSITIF_DATE_DEBUT: '2024-01-01',
      DISPOSITIF_DATE_FIN: '2024-12-31',
      Statuts: [Status.Other],
      internalContact: { id: 1, name: 'test', mail: 'test@test.com' }
    },
    expected: {
      sendInitialMail: false,
      sendPeriodicMail: false,
      sendEolMail: false
    }
  },
  {
    name: 'no mail should be set if email_enable = false even if the rest of the data should created a send',
    testData: {
      tech: JSON.stringify({ email_enable: false }),
      DISPOSITIF_DATE_DEBUT: '2024-01-01',
      DISPOSITIF_DATE_FIN: '2025-06-10',
      Statuts: [Status.InProd],
      internalContact: { id: 1, name: 'test', mail: 'test@test.com' }
    },
    expected: {
      sendInitialMail: false,
      sendPeriodicMail: false,
      sendEolMail: false
    }
  },
  {
    name: 'periodic mail should be send if the last periodic mail sent is more than 6 month ago',
    testData: {
      tech: JSON.stringify({
        email_enable: true,
        eol_mail_sent_date: '2024-06-01T00:00:00.000Z',
        last_mail_sent_date: '2024-06-01T00:00:00.000Z',
        prod_release_date: '2024-06-01T00:00:00.000Z'
      }),
      DISPOSITIF_DATE_DEBUT: '2024-01-01',
      DISPOSITIF_DATE_FIN: '2026-06-10',
      Statuts: [Status.InProd],
      internalContact: { id: 1, name: 'test', mail: 'test@test.com' }
    },
    expected: {
      sendInitialMail: false,
      sendPeriodicMail: true,
      sendEolMail: false
    }
  },
  {
    name: 'EOL mail should be send in priority over periodic mail / old EOL mail should not count',
    testData: {
      tech: JSON.stringify({
        email_enable: true,
        eol_mail_sent_date: '2024-06-01T00:00:00.000Z',
        last_mail_sent_date: '2024-06-01T00:00:00.000Z',
        prod_release_date: '2024-06-01T00:00:00.000Z'
      }),
      DISPOSITIF_DATE_DEBUT: '2024-01-01',
      DISPOSITIF_DATE_FIN: '2025-06-10',
      Statuts: [Status.InProd],
      internalContact: { id: 1, name: 'test', mail: 'test@test.com' }
    },
    expected: {
      sendInitialMail: false,
      sendPeriodicMail: false,
      sendEolMail: true
    }
  },
  {
    name: 'EOL mail should not be sent again if it has been sent recently',
    testData: {
      tech: JSON.stringify({
        email_enable: true,
        eol_mail_sent_date: '2025-05-30T00:00:00.000Z',
        last_mail_sent_date: '2025-05-30T00:00:00.000Z',
        prod_release_date: '2024-06-01T00:00:00.000Z'
      }),
      DISPOSITIF_DATE_DEBUT: '2024-01-01',
      DISPOSITIF_DATE_FIN: '2025-06-10',
      Statuts: [Status.InProd],
      internalContact: { id: 1, name: 'test', mail: 'test@test.com' }
    },
    expected: {
      sendInitialMail: false,
      sendPeriodicMail: false,
      sendEolMail: false
    }
  },
  {
    name: 'no mail should be sent to ademe',
    testData: {
      tech: JSON.stringify({
        email_enable: true,
        eol_mail_sent_date: '2024-06-01T00:00:00.000Z',
        last_mail_sent_date: '2024-06-01T00:00:00.000Z',
        prod_release_date: '2024-06-01T00:00:00.000Z'
      }),
      DISPOSITIF_DATE_DEBUT: '2024-01-01',
      DISPOSITIF_DATE_FIN: '2025-06-10',
      Statuts: [Status.InProd],
      internalContact: { id: 1, name: 'test', mail: 'test@ademe.fr' }
    },
    expected: {
      sendInitialMail: false,
      sendPeriodicMail: false,
      sendEolMail: false
    }
  },
  {
    name: 'no mail should be send if one has been sent recently',
    testData: {
      tech: JSON.stringify({
        email_enable: true,
        eol_mail_sent_date: '2025-05-28T00:00:00.000Z',
        last_mail_sent_date: '2025-05-28T00:00:00.000Z',
        prod_release_date: '2024-06-01T00:00:00.000Z'
      }),
      DISPOSITIF_DATE_DEBUT: '2024-01-01',
      DISPOSITIF_DATE_FIN: '2025-06-10',
      Statuts: [Status.InProd],
      internalContact: { id: 1, name: 'test', mail: 'test@test.com' }
    },
    expected: {
      sendInitialMail: false,
      sendPeriodicMail: false,
      sendEolMail: false
    }
  }
]
