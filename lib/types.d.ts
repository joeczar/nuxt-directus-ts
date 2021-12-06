/* eslint-disable camelcase */
import { CookieSerializeOptions } from 'cookie'
import { Directus } from '@directus/sdk'
import { UserType } from '@directus/sdk/dist'
// import {}
// augment typings of Vue.js
import './vue'

export interface ModuleOptions {
  accessTokenCookieName: string
  refreshTokenCookieName: string
  apiUrl: string
}

type CookieValue = any

interface GetOptions {
  fromRes?: boolean
  parseJSON?: boolean
}

interface SetParams {
  name: string
  value: CookieValue
  opts?: CookieSerializeOptions
}

export interface NuxtCookies {
  set: (name: string, value: CookieValue, opts?: CookieSerializeOptions) => void
  setAll: (cookieArray: SetParams[]) => void
  get: <T = CookieValue>(name: string, opts?: GetOptions) => T
  getAll: <T = CookieValue[]>(opts?: GetOptions) => T
  remove: (name: string, opts?: CookieSerializeOptions) => void
  removeAll: () => void
}

type CustomTypes = {
  /*
	This type will be merged with Directus user type.
	It's important that the naming matches a directus
	collection name exactly. Typos won't get caught here
	since SDK will assume it's a custom user collection.
	*/
  auth_token: string
  directus_users: UserType
}

const directus = new Directus<CustomTypes>('https://api.example.com')

type DirectusType = typeof directus

declare module '@nuxt/vue-app' {
  interface NuxtAppOptions {
    $directus: DirectusType
    $cookies: NuxtCookies
  }
}
// Nuxt 2.9+
declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $directus: DirectusType
    $cookies: NuxtCookies
  }

  interface Context {
    $directus: DirectusType
    $cookies: NuxtCookies
  }
}
