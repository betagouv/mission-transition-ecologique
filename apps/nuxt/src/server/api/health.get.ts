import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'content-type', 'text/html')
  return 'OK'
})
