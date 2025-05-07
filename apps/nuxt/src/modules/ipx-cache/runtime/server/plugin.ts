import type { ServerResponse } from 'http'
import type { ModuleOptions } from '../../index'

import { createCache } from '../utils/cache'

import { CaptureStream } from '../utils/capture-stream'
import { PassThrough, Readable } from 'node:stream'

import { sendStream, setHeaders, getHeader } from 'h3'
import { defineNitroPlugin, useRuntimeConfig } from 'nitropack/runtime'

export default defineNitroPlugin((nitroApp) => {
  const config = <Required<ModuleOptions>>(<unknown>useRuntimeConfig().ipx)
  console.log('ipx cache config', config)
  const cacheStore = createCache(config.cacheDir, config.maxAge)

  nitroApp.hooks.hook('request', async function (event) {
    if (!event.path.startsWith('/_ipx/')) return

    const reqUrl = (event.path || '').replace(/\/_ipx\/|,|http(s?):\/\//g, '').replace('&', '-')
    const originalRes = event.node.res

    if (!getHeader(event, 'cache-control')?.includes('ipx-purge')) {
      /** Load from cache if there is any */
      const cached = await cacheStore.get(reqUrl)
      if (cached) {
        const readable = new Readable()

        readable._read = () => void 0
        readable.push(cached.buffer), readable.push(null)

        setHeaders(event, { ...(<NonNullable<unknown>>cached.meta), 'cache-status': 'HIT' })
        originalRes.setHeader = (_key, _val) => originalRes
        return sendStream(event, readable)
      }
    }

    const passThrough = new PassThrough()
    const captureStream = new CaptureStream()
    passThrough.pipe(captureStream)

    const originalWrite = originalRes.write.bind(originalRes) as (
      chunk: any,
      encoding?: BufferEncoding | ((error: Error | null | undefined) => void),
      callback?: (error: Error | null | undefined) => void
    ) => boolean
    const originalEnd = originalRes.end.bind(originalRes) as (
      chunk?: any,
      encoding?: BufferEncoding | ((error: Error | null | undefined) => void),
      callback?: () => void
    ) => ServerResponse

    originalRes.write = (
      chunk: any,
      encodingOrCallback?: BufferEncoding | ((error: Error | null | undefined) => void),
      callback?: (error: Error | null | undefined) => void
    ): boolean => {
      passThrough.write(chunk, encodingOrCallback as BufferEncoding, callback)
      return originalWrite(chunk, encodingOrCallback as BufferEncoding, callback)
    }

    originalRes.end = (
      chunk?: any,
      encodingOrCallback?: BufferEncoding | ((error: Error | null | undefined) => void),
      callback?: () => void
    ): ServerResponse => {
      if (chunk) passThrough.write(chunk, encodingOrCallback as BufferEncoding, callback)
      setHeaders(event, { 'cache-status': 'MISS' })
      originalEnd(chunk, encodingOrCallback, callback)
      if (originalRes.statusCode !== 200) return originalRes

      const buffer = captureStream.getBuffer()
      const meta = {
        ...originalRes.getHeaders(),
        'content-length': buffer.byteLength
      }
      cacheStore.set(reqUrl, { buffer, meta })

      return originalRes
    }
  })
})
