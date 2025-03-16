declare module 'vue-router' {
  import type { DefineComponent } from 'vue'

  export const RouterView: DefineComponent<{}, {}, any>
  export const RouterLink: DefineComponent<
    {
      to: string | Record<string, any>
      replace?: boolean
      activeClass?: string
      exactActiveClass?: string
      custom?: boolean
      ariaCurrentValue?: string
    },
    {},
    any
  >

  export function useRouter(): any
  export function useRoute(): any
  export function createRouter(options: any): any
  export function createWebHistory(base?: string): any
  export function createWebHashHistory(base?: string): any
  export function createMemoryHistory(base?: string): any
}
