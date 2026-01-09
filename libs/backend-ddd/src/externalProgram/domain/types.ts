export class ExternalProgramNotFoundError extends Error {
  constructor(id: string) {
    super(`External program with id ${id} not found`)
    this.name = 'ExternalProgramNotFoundError'
  }
}
