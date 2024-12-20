import { defineNuxtModule } from '@nuxt/kit'
import { readFileSync } from 'fs'
import { join } from 'path'
import { workspaceRoot } from '@nx/devkit'
export default defineNuxtModule({
  meta: {
    name: 'tsconfig-paths-to-aliases',
    configKey: 'tsconfig-paths-to-aliases',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {},
  hooks: {},
  setup(moduleOptions, nuxt) {
    const tsconfig = JSON.parse(readFileSync(join(workspaceRoot, 'tsconfig.base.json')).toString())
    const paths = tsconfig.compilerOptions.paths
    const aliasesToNitro = Object.entries(paths).reduce((aliases, [aliasKey, aliasValue]) => {
      return { ...aliases, [aliasKey]: join(workspaceRoot, (aliasValue as string[])[0]) }
    }, {})
    const pathsToNitro = Object.entries(paths).reduce((aliases, [aliasKey, aliasValue]) => {
      return { ...aliases, [aliasKey]: [join(workspaceRoot, (aliasValue as string[])[0])] }
    }, {})
    nuxt.options.nitro.alias ??= {}
    nuxt.options.nitro.typescript ??= {}
    nuxt.options.nitro.typescript.tsConfig ??= {}
    nuxt.options.nitro.typescript.tsConfig.compilerOptions ??= {}
    nuxt.options.nitro.typescript.tsConfig.compilerOptions.paths ??= {}

    nuxt.options.nitro.alias = { ...nuxt.options.nitro.alias, ...aliasesToNitro }
    nuxt.options.nitro.typescript.tsConfig.compilerOptions.paths = {
      ...nuxt.options.nitro.typescript.tsConfig.compilerOptions.paths,
      ...pathsToNitro
    }
  }
})
