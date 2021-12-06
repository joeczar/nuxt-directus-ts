import Vue, { Context } from 'vue'
import jwtDecode from 'jwt-decode'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { Directus, BaseStorage, Auth, AxiosTransport } from '@directus/sdk'
import { Plugin } from '@nuxt/types'
import { PluginStorage } from './Storage'

declare module '@nuxt/types' {
  interface Context {
    $directus: void
  }
}

const directusPlugin: Plugin = async (context, inject) => {
  const options = JSON.parse(`<%= JSON.stringify(options) %>`)

  const directus = new Directus(options.apiUrl, {
    storage: new PluginStorage(null, context, options),
    auth,
    transport
  })

  inject('directus', directus)
  context.app.$directus = {}
}
export default directusPlugin
