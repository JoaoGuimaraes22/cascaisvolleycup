'use client'
import {
  createLocalizedPathnamesNavigation,
  Pathnames
} from 'next-intl/navigation'
import { locales } from './i18n'

export const localePrefix = 'always'

export const pathnames = {
  '/': '/',
  '/about': '/about',
  '/hall-of-fame': '/hall-of-fame',
  '/program': '/program',
  '/registration': '/registration',
  '/news': '/news',
  '/location': '/location',
  '/gallery': '/gallery',
  '/gallery/2025': '/gallery/2025',
  '/gallery/2024': '/gallery/2024',
  '/gallery/2023': '/gallery/2023',
  '/accommodation': '/accommodation',
  '/competition': '/competition'
} satisfies Pathnames<typeof locales>

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation({ locales, localePrefix, pathnames })

export type ValidPathname = keyof typeof pathnames
