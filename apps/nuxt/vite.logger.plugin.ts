import { Plugin } from 'vite'

const isVitePostCssWarning = (msg: string) => {
  return msg.includes('[vite:css][postcss]') && msg.includes(' @charset must precede')
}

export function suppressWarningsPlugin(): Plugin {
  return {
    name: 'suppress-warnings',
    apply: 'serve',
    configureServer(server) {
      const originalWarn = server.config.logger.warn
      server.config.logger.warn = (msg, ...args) => {
        if (isVitePostCssWarning(msg)) {
          return
        }

        originalWarn(msg, ...args)
      }
    }
  }
}
