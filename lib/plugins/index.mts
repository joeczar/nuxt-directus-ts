import Vue, { Context } from 'vue'
import { Directus } from '@directus/sdk'
import { Plugin } from '@nuxt/types'
import { PluginStorage } from './Storage'
import { PluginAuth } from './Auth'

const directusPlugin: Plugin = async (context, inject) => {
  const options = JSON.parse(`<%= JSON.stringify(options) %>`)
  const auth = new PluginAuth(context, options)
  const directus = new Directus(options.apiUrl, {
    storage: new PluginStorage(null, context, options),
    auth,
    transport
  })

  inject('directus', directus)
  context.app.$directus = directus
}
export default directusPlugin
