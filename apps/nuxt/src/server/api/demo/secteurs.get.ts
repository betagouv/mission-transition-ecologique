import { defineEventHandler } from 'h3'
import { sectorStats } from '@tee/data/static'

export default defineEventHandler(() => {
  return sectorStats
})
