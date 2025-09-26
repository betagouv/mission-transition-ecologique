import { describe, test, expect, beforeEach, vi } from 'vitest'
import { LoggerInterface, LoggerType, LogLevel } from '../../src/common/logger/types'
import { FaqConverter } from '../../src/faq/faqConverter'
import { FaqConverterInterface } from '../../src/faq/types/domain'
import { FaqPage } from '../../src/faq/types/shared'
import { LoggerMock } from '../logger.mock'
import { FaqBaserowMock } from './faqBaserow.mock'
import { BaserowFaq } from '../../src/common/baserow/types'

describe('FaqConverter', () => {
  let faqConverter: FaqConverterInterface
  let mockLogger: LoggerInterface

  beforeEach(() => {
    mockLogger = new LoggerMock()
    vi.spyOn(mockLogger, 'log')
    faqConverter = new FaqConverter(mockLogger)
  })

  describe('toDomain', () => {
    test('should convert fixture data to domain format correctly', async () => {
      const { baserowFaqs, baserowFaqSections } = await new FaqBaserowMock().getFaqs()

      const result = faqConverter.toDomainByPages(baserowFaqs, baserowFaqSections)

      // Should have pages based on fixture data
      expect(Object.keys(result).length).toBeGreaterThan(0)

      // Check that sections have the proper structure
      for (const page in result) {
        const sections = result[page as FaqPage]
        expect(Array.isArray(sections)).toBe(true)

        if (sections && sections.length > 0) {
          sections.forEach((section) => {
            expect(section).toHaveProperty('title')
            expect(section).toHaveProperty('color')
            expect(section).toHaveProperty('questions')
            expect(Array.isArray(section.questions)).toBe(true)

            section.questions.forEach((question) => {
              expect(question).toHaveProperty('id')
              expect(question).toHaveProperty('question')
              expect(question).toHaveProperty('answer')
              expect(typeof question.id).toBe('number')
            })
          })
        }
      }
    })

    test('should handle empty input arrays', () => {
      const result = faqConverter.toDomainByPages([], [])
      expect(result).toEqual({})
    })

    test('should properly sort questions by order', async () => {
      const { baserowFaqSections } = await new FaqBaserowMock().getFaqs()
      const baserowFaqs: BaserowFaq[] = [
        {
          id: 1,
          Question: 'Test question 1',
          Réponse: 'Test answer 1',
          Actif: true,
          Page: {
            id: 3827578,
            value: 'FAQ',
            color: 'orange'
          },
          Section: [
            {
              id: 1,
              value: 'Comment marche cet outil ?',
              order: '1.00000000000000000000'
            }
          ],
          order: '1.50000000000000000000' as unknown as number,
          Projet: []
        },
        {
          id: 2,
          Question: 'Test question 2',
          Réponse: 'Test answer 2',
          Actif: true,
          Page: {
            id: 3827578,
            value: 'FAQ',
            color: 'orange'
          },
          Section: [
            {
              id: 1,
              value: 'Comment marche cet outil ?',
              order: '1.00000000000000000000'
            }
          ],
          order: '1.00000000000000000000' as unknown as number,
          Projet: []
        }
      ]

      const result = faqConverter.toDomainByPages(baserowFaqs, baserowFaqSections)

      // Check that questions are sorted by order
      for (const page in result) {
        const sections = result[page as FaqPage]
        if (sections) {
          for (const section of sections) {
            for (const [index, question] of section.questions.entries()) {
              if (index > 0) {
                expect(question.id).toBeLessThan(section.questions[index - 1].id)
              }
            }
          }
        }
      }
    })
  })

  describe('page mapping', () => {
    test('should skip FAQs with unknown page names', async () => {
      const { baserowFaqSections } = await new FaqBaserowMock().getFaqs()
      const unknownPageFaq: BaserowFaq = {
        id: 999,
        Question: 'Test question',
        Réponse: 'Test answer',
        Actif: true,
        Page: { id: 999, value: 'Unknown Page', color: 'blue' },
        Section: [
          {
            id: 1,
            value: 'Comment marche cet outil ?',
            order: '1.00000000000000000000'
          }
        ],
        order: 1,
        Projet: []
      }

      const result = faqConverter.toDomainByPages([unknownPageFaq], baserowFaqSections)
      expect(mockLogger.log).toHaveBeenCalledWith(
        LogLevel.Critic,
        'FAQ non lié à une page statique ni à un projet',
        `FAQ ID Baserow: ${unknownPageFaq.id}`,
        unknownPageFaq.id,
        unknownPageFaq.id,
        LoggerType.Faq
      )
      expect(Object.keys(result)).toHaveLength(0)
    })
  })

  describe('section cases', () => {
    test('should handle FAQs with missing sections gracefully', async () => {
      const { baserowFaqSections } = await new FaqBaserowMock().getFaqs()
      const faqWithMissingSection: BaserowFaq = {
        id: 999,
        Question: 'Test question',
        Réponse: 'Test answer',
        Actif: true,
        Page: { id: 3827575, value: 'Accueil', color: 'blue' },
        Section: [{ id: 999, value: 'Missing Section', order: '1.0' }], // Non-existent section
        order: 1,
        Projet: []
      }

      const result = faqConverter.toDomainByPages([faqWithMissingSection], baserowFaqSections)
      expect(Object.keys(result)).toHaveLength(0)
    })
  })
})
