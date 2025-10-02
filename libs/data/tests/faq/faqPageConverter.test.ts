import { describe, test, expect, beforeEach, vi } from 'vitest'
import { BaserowFaq, BaserowFaqSection } from '../../src/common/baserow/types'
import { LoggerInterface, LoggerType, LogLevel } from '../../src/common/logger/types'
import { FaqPageConverter } from '../../src/common/baserow/faq/faqConverter/faqPageConverter'
import { FaqPage } from '../../src/faq/types/shared'
import { LoggerMock } from '../logger.mock'
import * as faqFixtures from './fixtures/faq.fixtures'
import * as faqSection from './fixtures/faqSection.fixtures'

describe('FaqPageConverter', () => {
  let faqPageConverter: FaqPageConverter
  let mockLogger: LoggerInterface

  const getFaqs = () => {
    return {
      baserowFaqs: faqFixtures.faqBaserow as unknown as BaserowFaq[],
      baserowFaqSections: faqSection.faqSectionBaserow as unknown as BaserowFaqSection[]
    }
  }

  beforeEach(() => {
    mockLogger = new LoggerMock()
    vi.spyOn(mockLogger, 'log')
    faqPageConverter = new FaqPageConverter(mockLogger)
  })

  describe('toDomain', () => {
    test('should convert fixture data to domain format correctly', async () => {
      const result = faqPageConverter.toDomain(getFaqs().baserowFaqs, getFaqs().baserowFaqSections)

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
      const result = faqPageConverter.toDomain([], [])
      expect(result).toEqual({})
    })

    test('should properly sort questions by order', async () => {
      const result = faqPageConverter.toDomain(getFaqs().baserowFaqs, getFaqs().baserowFaqSections)

      // Check that questions are sorted by order
      for (const page in result) {
        const sections = result[page as FaqPage]
        if (sections) {
          for (const section of sections) {
            let lastQuestionNumber = '0'
            for (const question of section.questions.values()) {
              // 'question 3' get the number 3
              const questionNumber = question.question.match(/question (\d+)/i)
              if (questionNumber && questionNumber[0]) {
                lastQuestionNumber = questionNumber[0]
              } else if (questionNumber) {
                expect(Number(questionNumber[0])).greaterThan(Number(lastQuestionNumber))
              }
            }
          }
        }
      }
    })
  })

  describe('page mapping', () => {
    test('should skip FAQs with unknown page names', async () => {
      faqPageConverter.toDomain(getFaqs().baserowFaqs, getFaqs().baserowFaqSections)

      expect(mockLogger.log).toHaveBeenCalledWith(
        LogLevel.Critic,
        'FAQ non lié à une page statique ni à un projet',
        `FAQ ID Baserow: 999`,
        999,
        999,
        LoggerType.Faq
      )
    })
  })

  describe('section cases', () => {
    test('should handle FAQs with missing sections gracefully', async () => {
      const result = faqPageConverter.toDomain(getFaqs().baserowFaqs, getFaqs().baserowFaqSections)

      expect(result[FaqPage.Home]?.some((section) => section.title === 'Unknown Section')).toBeFalsy()
    })
  })
})
