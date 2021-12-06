import createAuthRefreshInterceptor from 'axios-auth-refresh'
import type { Context } from '@nuxt/types'
import jwtDecode from 'jwt-decode'
import { Directus } from '@directus/sdk'
import { AuthCredentials } from '@directus/sdk/dist'

import { CustomTypes, ModuleOptions } from '../types'

export class PluginAuth {
  public options: ModuleOptions
  public $directus: Directus<CustomTypes>
  public $store
  public $cookies
  public refreshTimer: any

  constructor(context: Context, options: ModuleOptions) {
    this.options = options
    this.$directus = context.$directus
    this.$store = context.store
    this.$cookies = context.$cookies
    this.refreshTimer = null

    createAuthRefreshInterceptor(
      this.$directus.transport.axios,
      (failedRequest) => {
        if (
          process.client &&
          this.$cookies.get(this.options.refreshTokenCookieName)
        ) {
          return this.refresh().then((newToken) => {
            failedRequest.response.config.headers.Authorization = `Bearer ${newToken}`
            return Promise.resolve()
          })
        } else {
          return Promise.reject(failedRequest)
        }
      }
    )
  }

  get user() {
    return this.$store.state.auth.user
  }

  async login(credentials: AuthCredentials) {
    const loginData = await this.$directus.auth.login(credentials)
    this.$cookies.set(
      this.options.accessTokenCookieName,
      loginData.access_token
    )
    const data = await this.$directus.users.me.read({
      fields: '*,languages.id,languages.languages_code'
    })
    await this.$store.commit('auth/SET_USER', data)
    this.refreshTimer = setTimeout(() => {
      this.refresh()
    }, this._getTimeUntilRefreshNeeded(loginData.access_token))

    return data
  }

  async logout() {
    await this.$directus.auth.logout()
    if (process.client) {
      this.refreshTimer = clearTimeout(this.refreshTimer)
    }
    this.$cookies.remove(this.options.accessTokenCookieName)
    this.$cookies.remove(this.options.refreshTokenCookieName)
    await this.$store.commit('auth/SET_USER', null)
  }

  async refresh() {
    this.refreshTimer = clearTimeout(this.refreshTimer)
    const response = await this.$directus.transport.axios.post(
      '/auth/refresh',
      {
        refresh_token: this.$cookies.get(this.options.refreshTokenCookieName)
      },
      {
        skipAuthRefresh: true,
        headers: {
          Authorization: ''
        }
      }
    )

    this.$cookies.set(
      this.options.refreshTokenCookieName,
      response.data.data.refresh_token
    )
    this.$cookies.set(
      this.options.accessTokenCookieName,
      response.data.data.access_token
    )
    this.$directus.auth_token = response.data.data.access_token
    this.refreshTimer = setTimeout(() => {
      this.refresh()
    }, this._getTimeUntilRefreshNeeded(response.data.data.access_token))
    return response.data.data.access_token
  }

  _getTimeUntilRefreshNeeded(token: string) {
    const decodedToken: Record<string, any> = jwtDecode(token)
    const validUntil: number = decodedToken.exp
    return validUntil * 1000 - Date.now() - 300000
  }
}
