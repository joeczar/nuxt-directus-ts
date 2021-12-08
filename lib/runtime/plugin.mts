export default function (context, inject) {
  inject('nuxt-directus-ts', {})
  context.app['nuxt-directus-ts'] = {}
}
