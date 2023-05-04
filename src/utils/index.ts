import { status } from './choicesStatus'
import { needs } from './choicesNeeds'
import { sectors } from './choicesSectors'
import { sizes } from './choicesStructureSizes'

export const maxDepth = 4

export const tracks = [
  { 
    id: 'status',
    config: status
  },
  { 
    id: 'needs',
    config: needs
  },
  { 
    id: 'sectors',
    config: sectors
  },
  { 
    id: 'sizes',
    config: sizes
  }
]
