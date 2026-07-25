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
  BG: '/img/landing/home-bg.webp',
  LEFT: '/img/landing/home-left.webp',
  RIGHT: '/img/landing/home-right.webp',
  TAGLINE: GLOBAL_ASSETS.taglineWhite,
  CMC: '/img/landing/cascais-para-toda-a-vida-w.webp',
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

      {/* Large-desktop-only (≥1440px) full-height player cutouts flanking the centered logo/info.
          Gated at 1440 (not xl/1280) so narrower laptops keep the clean centered hero — below that the logo crowds the players. */}
      <div className='hero-in-left pointer-events-none absolute inset-y-0 left-0 z-10 hidden min-[1440px]:block'>
        <Image
          src={ASSETS.LEFT}
          alt=''
          width={382}
          height={1300}
          sizes='(min-width: 1440px) 30vw, 0px'
          className='h-full w-auto object-contain object-bottom drop-shadow-2xl'
        />
      </div>
      <div className='hero-in-right pointer-events-none absolute inset-y-0 right-0 z-10 hidden min-[1440px]:block'>
        <Image
          src={ASSETS.RIGHT}
          alt=''
          width={565}
          height={1300}
          sizes='(min-width: 1440px) 30vw, 0px'
          className='h-full w-auto object-contain object-bottom drop-shadow-2xl'
        />
      </div>

      {/* Top corners (below the fixed header): Câmara Municipal de Cascais wordmark left, event tagline right */}
      <div className='hero-in-cmc absolute top-[calc(var(--header-h)_+_1.5rem)] left-4 z-30 sm:left-6 lg:left-8'>
        <Image
          src={ASSETS.CMC}
          alt='Cascais — Para toda a vida'
          width={1280}
          height={146}
          quality={90}
          sizes='(max-width: 640px) 170px, (max-width: 1024px) 260px, 340px'
          className='h-auto w-[170px] drop-shadow-lg sm:w-[260px] lg:w-[340px]'
        />
      </div>
      <div className='hero-in-tagline absolute top-[calc(var(--header-h)_+_1.5rem)] right-4 z-30 sm:right-6 lg:right-8'>
        <Image
          src={ASSETS.TAGLINE}
          alt={dict.taglineAlt}
          width={400}
          height={86}
          quality={95}
          sizes='(max-width: 640px) 150px, (max-width: 1024px) 220px, 300px'
          className='h-auto w-[150px] drop-shadow-2xl sm:w-[220px] lg:w-[300px]'
        />
      </div>

      <div className='relative z-20 flex min-h-screen flex-col items-center justify-center px-4 text-center'>
        <h1 id='hero-heading' className='sr-only'>
          {dict.heading}
        </h1>

        <div className='hero-in-logo flex flex-col items-center gap-4'>
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

        <div className='hero-in-cta mt-16 flex flex-col gap-3'>
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

      <div className='hero-in-scroll absolute bottom-8 left-1/2 -translate-x-1/2 text-white opacity-70'>
        <div className='flex flex-col items-center gap-2'>
          <span className='text-xs font-medium tracking-wider uppercase'>
            {dict.scrollDown}
          </span>
          <div className='h-8 w-px bg-white/60 motion-safe:animate-pulse' />
        </div>
      </div>

      <div className='hero-in-osports absolute right-4 bottom-4 z-30 h-[40px] w-[80px] sm:h-[50px] sm:w-[100px] lg:h-[60px] lg:w-[120px]'>
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
