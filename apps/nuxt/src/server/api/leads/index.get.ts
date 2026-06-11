import { defineEventHandler } from 'h3'
import { leads } from '@tee/data/static'

export default defineEventHandler(() => {
  return leads
})
