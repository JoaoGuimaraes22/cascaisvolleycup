import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/i18n-config'
import { localeHref } from '../../_lib/seo'
import { getBrochureFileName, GLOBAL_ASSETS } from '../../_lib/constants'

type WelcomeDict = {
  tagline_alt: string
  taglineAlt: string
  heading: string
  PORTUGAL: string
  dates: string
  avg_air_temp: string
  avg_air_temp_value: string
  airport: string
  airport_value: string
  location: string
  location_value: string
  scrollDown: string
  register: string
  brochure: string
}

type Props = {
  lang: Locale
  dict: WelcomeDict
}

const ASSETS = {
  BG: '/img/landing/hero-bg-new.webp',
  TAGLINE: GLOBAL_ASSETS.taglineWhite,
  LOGO: '/img/landing/hero-logo.webp',
  OSPORTS: '/img/sponsors/o-sports-w.webp'
} as const

export default function LandingWelcome({ lang, dict }: Props) {
  const brochureFile = getBrochureFileName(lang)

  return (
    <section
      role='region'
      aria-labelledby='hero-heading'
      className='relative -mt-16 min-h-screen w-full overflow-hidden md:-mt-20'
    >
      {/* Background — CSS scroll-driven parallax on supporting browsers (Chrome 115+, Edge, Firefox).
          Safari falls back to a static background. */}
      <div className='absolute inset-0 z-0'>
        <div className='hero-parallax-bg relative h-full w-full'>
          <Image
            src={ASSETS.BG}
            alt=''
            fill
            priority
            sizes='100vw'
            className='object-cover'
            quality={85}
          />
        </div>
      </div>

      <div className='relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center'>
        <div className='mb-6'>
          <Image
            src={ASSETS.TAGLINE}
            alt={dict.taglineAlt}
            width={400}
            height={86}
            priority
            quality={95}
            sizes='(max-width: 640px) 280px, 400px'
            className='h-auto w-[280px] drop-shadow-2xl sm:w-[400px]'
          />
        </div>

        <h1 id='hero-heading' className='sr-only'>
          {dict.heading}
        </h1>

        <div className='flex flex-col items-center gap-4'>
          <Image
            src={ASSETS.LOGO}
            alt='Cascais Volley Cup 2026'
            width={650}
            height={227}
            priority
            quality={95}
            sizes='(max-width: 640px) 350px, (max-width: 1024px) 500px, 650px'
            className='max-w-[350px] drop-shadow-2xl sm:max-w-[500px] md:max-w-[600px] lg:max-w-[650px]'
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>

        <div className='mt-16 flex flex-col gap-3'>
          <Link
            href={localeHref(lang, '/registration')}
            className='rounded-full bg-white px-6 py-3 text-center text-sm font-bold tracking-wide text-sky-500 uppercase drop-shadow-lg duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-xl motion-safe:transition-all sm:px-8 sm:py-4 sm:text-lg'
          >
            {dict.register}
          </Link>

          <a
            href={`/docs/${brochureFile}`}
            download={brochureFile}
            className='rounded-full bg-white px-6 py-3 text-center text-sm font-bold tracking-wide text-sky-500 uppercase drop-shadow-lg duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-xl motion-safe:transition-all sm:px-8 sm:py-4 sm:text-lg'
          >
            {dict.brochure}
          </a>
        </div>
      </div>

      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 text-white opacity-70'>
        <div className='flex flex-col items-center gap-2'>
          <span className='text-xs font-medium tracking-wider uppercase'>
            {dict.scrollDown}
          </span>
          <div className='h-8 w-px bg-white/60 motion-safe:animate-pulse' />
        </div>
      </div>

      <div className='absolute right-4 bottom-4 z-30 h-[40px] w-[80px] sm:h-[50px] sm:w-[100px] lg:h-[60px] lg:w-[120px]'>
        <Image
          src={ASSETS.OSPORTS}
          alt='O-Sports'
          fill
          sizes='(max-width: 640px) 80px, (max-width: 1024px) 100px, 120px'
          className='object-contain drop-shadow-lg'
          quality={75}
        />
      </div>
    </section>
  )
}
