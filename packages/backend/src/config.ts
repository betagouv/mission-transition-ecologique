export default class Config {
  public static get BPI_FRANCE_CLIENT_ID(): string {
    if (!process.env['BPI_FRANCE_CLIENT_ID']) {
      throw new Error('BPI_FRANCE_CLIENT_ID is not defined')
    }

    return process.env['BPI_FRANCE_CLIENT_ID']
  }

  public static get BPI_FRANCE_CLIENT_SECRET(): string {
    if (!process.env['BPI_FRANCE_CLIENT_SECRET']) {
      throw new Error('BPI_FRANCE_CLIENT_SECRET is not defined')
    }

    return process.env['BPI_FRANCE_CLIENT_SECRET']
  }
}
