import type { CurrentDateService } from '../domain/program/spi'

export const currentDateService: CurrentDateService = {
  // get: () => new Date().toLocaleDateString('fr-FR')
  get: () => '01/01/2024'
}
