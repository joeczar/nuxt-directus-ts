import { Module } from '@nuxt/types'
import { ModuleOptions } from './types'
const { resolve, join } = require('path')

const CONFIG_KEY = 'nuxt-directus-ts'

const nuxtModule: Module<ModuleOptions> = function (moduleOptions) {
  const options = Object.assign(
    {
      accessTokenCookieName: 'access_token',
      refreshTokenCookieName: 'refresh_token'
    },
    ...this.options.directus,
    moduleOptions
  )

  // expose the namespace / set a default
  if (!options.namespace) options.namespace = 'nuxtDirectusTs'
  const { namespace } = options

  const pluginsToSync = ['plugin/index.js', 'middleware/index.js']
  for (const pathString of pluginsToSync) {
    this.addPlugin({
      src: resolve(__dirname, pathString),
      fileName: join(namespace, pathString),
      options
    })
  }
}

;(nuxtModule as any).meta = require('../package.json')

declare module '@nuxt/types' {
  interface NuxtConfig {
    [CONFIG_KEY]: ModuleOptions
  } // Nuxt 2.14+
  interface Configuration {
    [CONFIG_KEY]: ModuleOptions
  } // Nuxt 2.9 - 2.13
  interface Context {
    ['$nuxt-directus-ts']: {}
  }
}
module.exports.meta = require('./package.json')

export default nuxtModule
