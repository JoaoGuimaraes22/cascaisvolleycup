import createMiddleware from 'next-intl/middleware'
import { locales } from './i18n'
import { localePrefix } from './navigation'

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix
})

export const config = {
  matcher: ['/', '/(fr|en|es|pt)/:path*']
}
