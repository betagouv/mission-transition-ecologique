import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { type BuildOptions, defineConfig } from 'vite'
import type { ServerOptions } from 'vite'
import vue from '@vitejs/plugin-vue'

console.log('Starting ...')
console.log('vite.config ...')

const mode = process.env.NODE_ENV ?? 'development'
const isProd = mode === 'production'

type LibType = 'main' | 'widget'
const LIB: LibType = (process.env.LIB as LibType) ?? 'main'
const libConfig: Record<LibType, BuildOptions> = {
  main: {
    emptyOutDir: false
  },
  widget: {
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, 'widget.html')
    },
    lib: {
      name: 'gov-aid-tree-app',
      entry: 'widget/widget.ce.ts',
      fileName: 'widget'
    }
  }
}

const plugins = async () => {
  const basePlugins = [vue()]
  if (isProd) {
    return basePlugins
  } else {
    const eslintPlugin = await import('vite-plugin-eslint')
    return [...basePlugins, eslintPlugin.default()]
  }
}

const currentConfig = libConfig[LIB]

const viteServer: ServerOptions = {
  host: '0.0.0.0',
  port: 4242,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      secure: false
    }
  },
  headers: {
    'Content-Security-Policy':
      "default-src 'none';" +
      "base-uri 'self';" +
      "form-action 'self';" +
      "script-src 'self';" +
      "script-src-elem 'self' 'unsafe-inline' https://stats.beta.gouv.fr;" +
      "style-src 'self' 'unsafe-inline';" +
      "font-src 'self';" +
      "img-src 'self' data:;" +
      "object-src 'self';" +
      "connect-src 'self' https://place-des-entreprises.beta.gouv.fr https://stats.beta.gouv.fr;" +
      "frame-src 'self' https://place-des-entreprises.beta.gouv.fr;" +
      "frame-ancestors 'self' https://place-des-entreprises.beta.gouv.fr;",
    'X-Frame-Options': 'ALLOW-FROM https://place-des-entreprises.beta.gouv.fr',
    'X-Content-Type-Options': 'nosniff'
  }
}

export default defineConfig({
  server: viteServer,
  plugins: [plugins()],
  build: currentConfig,
  define: {
    'process.env': process.env
  },
  resolve: {
    alias: {
      // cf: https://stackoverflow.com/questions/72660014/how-to-make-vue-and-vite-work-with-web-components
      '~@gouvfr': fileURLToPath(new URL('../../node_modules/@gouvfr', import.meta.url)),
      '~@gouvminint': fileURLToPath(new URL('../../node_modules/@gouvminint', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@public': fileURLToPath(new URL('./public', import.meta.url)),
      '@icons': fileURLToPath(new URL('../../node_modules/oh-vue-icons', import.meta.url))
    }
  }
})
