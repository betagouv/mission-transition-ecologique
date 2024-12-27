import { Sector } from '../questionnaire/types/types'

export const SectorToNAFSection: Record<Sector, string[]> = {
  [Sector.Craftsmanship]: ['C', 'F', 'G'],
  [Sector.Industry]: ['B', 'C', 'D', 'E'],
  [Sector.Tourism]: ['I'],
  [Sector.Tertiary]: ['G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U'],
  [Sector.Agriculture]: ['A'],
  [Sector.Other]: ['D', 'E', 'F', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U']
}

export const NAF1Letters = [...'ABCDEFGHIJKLMNOPQRSTU'] as const
