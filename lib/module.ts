import { Module } from '@nuxt/types'
// import Vue from 'vue'
// import { VueConstructor } from 'vue/types'
// import { Directus } from '@directus/sdk'

const path = require('path')

export interface ModuleOptions {
  apiUrl: string
}
const CONFIG_KEY = 'nuxt-directus-ts'

const nuxtModule: Module<ModuleOptions> = function (moduleOptions) {
  const options = {
    ...this.options.directus,
    ...moduleOptions
  }

  const runtimeDir = path.resolve(__dirname, 'runtime')
  this.nuxt.options.alias['~nuxt-module-template'] = runtimeDir
  this.nuxt.options.build.transpile.push(runtimeDir)

  this.addPlugin({
    src: path.resolve(runtimeDir, 'plugin.mjs'),
    fileName: 'nuxt-module-template.js',
    options
  })
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
    ['$nuxt-module-template']: {}
  }
}

export default nuxtModule
// Vue.use({
//   // install: (app: VueConstructor) => {
//   //   Vue.prototype.$directus = directus
//   //   // Vue.prototype.$auth = directus.auth
//   //   app.mixin({
//   //     data() {
//   //       return {}
//   //     }
//   //   })
//   // }
// })
