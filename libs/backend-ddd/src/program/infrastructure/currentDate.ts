import type { CurrentDateService } from '../domain/spi'

export const currentDateService: CurrentDateService = {
  get: () => new Date().toLocaleDateString('fr-FR')
}
