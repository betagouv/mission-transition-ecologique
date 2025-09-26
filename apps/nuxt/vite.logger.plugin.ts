import { Plugin } from 'vite'

export function suppressWarningsPlugin(): Plugin {
  return {
    name: 'suppress-warnings',
    apply: 'serve',
    configureServer(server) {
      const originalWarn = server.config.logger.warn
      server.config.logger.warn = (msg, ...args) => {
        if (msg.includes('[vite:css][postcss]') && msg.includes(' @charset must precede')) {
          return
        }
        originalWarn(msg, ...args)
      }
    }
  }
}
