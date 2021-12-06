/* eslint-disable camelcase */
import { BaseStorage } from '@directus/sdk'
import type { Context } from '@nuxt/types'
import { ModuleOptions } from '../types'

export class PluginStorage extends BaseStorage {
  public prefix: string
  public options: ModuleOptions
  public context: Context

  constructor(prefix = '', context: Context, options: ModuleOptions) {
    super()
    this.prefix = prefix
    this.options = options
    this.context = context
  }

  get(key: string) {
    const data = this.context.$cookies.get(key)
    if (data !== null) {
      return data
    }
    return null
  }

  set(key: string, value: string) {
    this.context.$cookies.set(key, value)
    return value
  }

  delete(key: string) {
    const value = this.get(key)
    this.context.$cookies.remove(key)
    return value
  }

  get auth_token() {
    return this.get(this.options.accessTokenCookieName)
  }

  set auth_token(value) {
    if (value === null) {
      this.delete(this.options.accessTokenCookieName)
    } else {
      this.set(this.options.accessTokenCookieName, value)
    }
  }

  get auth_expires() {
    const value = this.get('auth_expires')
    if (value === null) {
      return null
    }
    return parseInt(value)
  }

  set auth_expires(value) {
    if (value === null) {
      this.delete('auth_expires')
    } else {
      this.set('auth_expires', value.toString())
    }
  }

  get auth_refresh_token() {
    return this.get(this.options.refreshTokenCookieName)
  }

  set auth_refresh_token(value) {
    if (value === null) {
      this.delete(this.options.refreshTokenCookieName)
    } else {
      this.set(this.options.refreshTokenCookieName, value)
    }
  }
}
