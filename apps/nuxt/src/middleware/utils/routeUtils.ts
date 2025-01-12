import type { RouteLocationNormalized } from 'vue-router'

export default class RouteUtils {
  static readonly hasQuery = (route: RouteLocationNormalized) => {
    return Object.keys(route.query).length
  }

  static hasNameRoute(from: RouteLocationNormalized) {
    return from.name !== undefined
  }
}
