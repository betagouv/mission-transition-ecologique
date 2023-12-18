import { Controller, Example, Get, Produces, Route } from 'tsoa'

@Route('health')
@Produces('text/plain')
export class HealthController extends Controller {
  /**
   * Check the API's health. If the API is up and running, this endpoint
   * should return a 200 HTTP status.
   *
   * @summary Check the API's health
   */
  @Example<string>('OK')
  @Get()
  public health(): string {
    this.setStatus(200)
    this.setHeader('Content-Type', 'text/plain')
    return 'OK'
  }
}
