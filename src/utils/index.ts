import { status } from './choicesStatus'
import { needs } from './choicesNeeds'
import { sectors } from './choicesSectors'
import { sizes } from './choicesStructureSizes'

export const tracks = [
  { 
    id: 'status',
    config: status,
    next: {
      default: 'sectors'
    }
  },
  { 
    id: 'sectors',
    config: sectors,
    next: {
      default: 'needs'
    }
  },
  { 
    id: 'needs',
    config: needs,
    next: {
      default: 'sizes'
    }
  },
  { 
    id: 'sizes',
    config: sizes,
    next: {
      default: 'results'
    }
  }
]
