'use client'

import { FC, useMemo } from 'react'
import Image from 'next/image'
import { Link } from '@/src/navigation'
import { FiMail, FiPhone, FiMapPin, FiGlobe } from 'react-icons/fi'
import { FaInstagram, FaYoutube } from 'react-icons/fa'
import { useTranslations, useLocale } from 'next-intl'
import clsx from 'clsx'

interface Props {
  locale: string
}

interface Sponsor {
  src: string
  alt: string
  w: number
  h: number
  url?: string
}

const Footer: FC<Props> = ({ locale }) => {
  const t = useTranslations('Footer')
  const currentLocale = useLocale()

  const LOGO = '/img/global/cascais-volley-cup-1.webp'
  const EMAIL = 'info@volley4all.com'
  const PHONE = '(00351) 964 415 632'
  const WEBSITE_URL = 'https://www.volley4all.com'
  const INSTAGRAM_URL = 'https://www.instagram.com/cascais_volley_cup'
  const YOUTUBE_URL = 'https://www.youtube.com/@cascais_volley4all/'

  // Language mapping for brochure files
  const getLanguageCode = (locale: string) => {
    const languageMap = {
      en: 'UK',
      es: 'ESP',
      pt: 'PT',
      fr: 'FRAN'
    } as const

    return languageMap[locale as keyof typeof languageMap] || 'UK'
  }

  const getBrochureFileName = () => {
    const langCode = getLanguageCode(currentLocale)
    return `CVCUP-2026-CONVITE-${langCode}.pdf`
  }

  // Memoized sponsors data with potential links
  const sponsors: Sponsor[] = useMemo(
    () => [
      {
        src: '/img/sponsors/cam-ford.webp',
        alt: 'C.A.M. Ford',
        w: 220,
        h: 80,
        url: 'https://www.cam.pt'
      },
      {
        src: '/img/sponsors/cascais-camara.webp',
        alt: 'Cascais Câmara Municipal',
        w: 220,
        h: 80,
        url: 'https://www.visitcascais.com'
      },
      {
        src: '/img/sponsors/fpv.webp',
        alt: 'Federação Portuguesa de Voleibol',
        w: 220,
        h: 80,
        url: 'https://www.fpvoleibol.pt'
      },
      {
        src: '/img/sponsors/cascais-estoril.webp',
        alt: 'Cascais Estoril',
        w: 220,
        h: 80,
        url: 'https://www.jf-cascaisestoril.pt'
      },
      {
        src: '/img/sponsors/volley4all.webp',
        alt: 'Volley4All Sparrows',
        w: 220,
        h: 80,
        url: 'https://www.volley4all.com'
      },
      {
        src: '/img/sponsors/o-sports.webp',
        alt: 'Feel the summer',
        w: 220,
        h: 80,
        url: 'https://www.o-sports.pt'
      }
    ],
    []
  )

  const currentYear = new Date().getFullYear()

  return (
    <footer
      role='contentinfo'
      className="relative w-full border-t border-slate-200/60 bg-slate-100/95 bg-[url('/img/footer/footer-bg.webp')] bg-cover bg-center backdrop-blur"
    >
      <div className='mx-auto max-w-screen-lg px-4 py-8 sm:py-10'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Logo & Description */}
          <div className='sm:col-span-2 lg:col-span-1'>
            <Link
              lang={locale}
              href='/'
              aria-label={t('logoAria') || 'Cascais Volley Cup - Home'}
              className='inline-block rounded-sm transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2'
            >
              <Image
                src={LOGO}
                alt='Cascais Volley Cup'
                width={200}
                height={72}
                className='h-12 w-auto md:h-14'
                loading='lazy'
                quality={80}
              />
            </Link>
            <p className='mt-4 text-sm leading-relaxed text-slate-600'>
              {t('description') ||
                'The premier volleyball tournament in beautiful Cascais, Portugal. Join us for an unforgettable sporting experience.'}
            </p>
          </div>

          {/* Quick Links */}
          <nav className='lg:col-span-1' aria-labelledby='quick-links-heading'>
            <h3
              id='quick-links-heading'
              className='mb-4 text-sm font-semibold uppercase tracking-wider text-slate-800'
            >
              {t('quickLinks') || 'Quick Links'}
            </h3>
            <ul className='space-y-2'>
              {[
                { href: '/about', label: t('about') || 'About' },
                { href: '/program', label: t('program') || 'Program' },
                {
                  href: '/competition',
                  label: t('competition') || 'Competition'
                },
                {
                  href: '/accommodation',
                  label: t('accommodation') || 'Accommodation'
                },
                { href: '/gallery', label: t('gallery') || 'Gallery' },
                {
                  href: '/hall-of-fame',
                  label: t('hallOfFame') || 'Hall of Fame'
                }
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    lang={locale}
                    href={href as any}
                    className='rounded-sm text-sm text-sky-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 sm:text-slate-600 sm:hover:text-sky-700'
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <div className='lg:col-span-1'>
            <h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-slate-800'>
              {t('contact') || 'Contact'}
            </h3>
            <div className='space-y-3'>
              <ContactItem
                icon={<FiMail className='h-4 w-4' />}
                href={`mailto:${EMAIL}`}
                text={EMAIL}
                label={t('email') || 'Email us'}
              />
              <ContactItem
                icon={<FiPhone className='h-4 w-4' />}
                href={`tel:${PHONE.replace(/\s/g, '')}`}
                text={PHONE}
                label={t('phone') || 'Call us'}
              />
              <ContactItem
                icon={<FiMapPin className='h-4 w-4' />}
                text='Cascais, Portugal'
                label={t('location') || 'Our location'}
              />
            </div>
          </div>

          {/* Social & CTA */}
          <div className='lg:col-span-1'>
            <h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-slate-800'>
              {t('followUs') || 'Follow Us'}
            </h3>

            {/* Social Icons */}
            <div className='mb-6 flex items-center gap-3'>
              <SocialIcon
                href={WEBSITE_URL}
                ariaLabel={t('website') || 'Visit our website'}
                title='Website'
                icon={<FiGlobe className='h-4 w-4' />}
              />
              <SocialIcon
                href={INSTAGRAM_URL}
                ariaLabel={t('instagram') || 'Visit our Instagram profile'}
                title='Instagram'
                icon={<FaInstagram className='h-4 w-4' />}
              />
              <SocialIcon
                href={YOUTUBE_URL}
                ariaLabel={t('youtube') || 'Visit our YouTube channel'}
                title='YouTube'
                icon={<FaYoutube className='h-4 w-4' />}
              />
            </div>

            {/* CTA Button */}
            <Link
              lang={locale}
              href='/registration'
              className='inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-sky-600 to-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-black/10 transition-all hover:scale-105 hover:from-sky-700 hover:to-sky-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2'
              aria-label={t('registrationCTA') || 'Register for the tournament'}
            >
              {t('registration') || 'Registration'}
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className='my-8 h-px w-full bg-gradient-to-r from-transparent via-slate-300/60 to-transparent' />

        {/* Sponsors Section */}
        <div className='text-center'>
          <h3 className='mb-6 text-lg font-semibold text-slate-800'>
            {t('sponsors') || 'Our Partners & Sponsors'}
          </h3>
          <div className='mx-auto grid max-w-screen-lg grid-cols-2 items-center justify-items-center gap-6 sm:grid-cols-3 lg:grid-cols-6'>
            {sponsors.map((sponsor, index) => (
              <SponsorLogo key={index} sponsor={sponsor} />
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-8 border-t border-slate-200/60 pt-6'>
          <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
            <div className='text-xs text-slate-500'>
              © {currentYear} Cascais Volley Cup.{' '}
              {t('allRightsReserved') || 'All rights reserved.'}
            </div>
            <div className='flex gap-4 text-xs'>
              <a
                href={`/docs/${getBrochureFileName()}`}
                download={getBrochureFileName()}
                className='text-sky-700 transition-colors sm:text-slate-500 sm:hover:text-slate-700'
              >
                {t('brochure') || 'Brochure'}
              </a>
              <a
                href='/docs/CVCUP-2026-Regulamento-PT.pdf'
                download='CVCUP-2026-Regulamento-PT.pdf'
                className='text-sky-700 transition-colors sm:text-slate-500 sm:hover:text-slate-700'
              >
                {t('regulations') || 'Regulations'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* Helper Components */

const ContactItem: FC<{
  icon: React.ReactNode
  href?: string
  text: string
  label: string
}> = ({ icon, href, text, label }) => {
  const content = (
    <div className='flex items-center gap-2 text-sm text-slate-600'>
      <span className='text-sky-600' aria-hidden='true'>
        {icon}
      </span>
      <span>{text}</span>
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        aria-label={label}
        className='block rounded-sm transition-colors hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2'
      >
        {content}
      </a>
    )
  }

  return <div aria-label={label}>{content}</div>
}

const SocialIcon: FC<{
  href: string
  ariaLabel: string
  title: string
  icon: React.ReactNode
}> = ({ href, ariaLabel, title, icon }) => (
  <a
    href={href}
    aria-label={ariaLabel}
    title={title}
    className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-sky-700 shadow-sm ring-1 ring-slate-300 transition-all hover:scale-105 hover:bg-sky-50 hover:text-sky-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2'
    rel='noopener noreferrer'
    target='_blank'
  >
    {icon}
  </a>
)

const SponsorLogo: FC<{ sponsor: Sponsor }> = ({ sponsor }) => {
  const logoElement = (
    <Image
      src={sponsor.src}
      alt={sponsor.alt}
      width={sponsor.w}
      height={sponsor.h}
      className='h-auto max-h-16 w-auto object-contain transition-all hover:scale-105'
      sizes='(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 160px'
      loading='lazy'
      quality={80}
    />
  )

  if (sponsor.url) {
    return (
      <a
        href={sponsor.url}
        target='_blank'
        rel='noopener noreferrer'
        className='block rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2'
        aria-label={`Visit ${sponsor.alt} website`}
      >
        {logoElement}
      </a>
    )
  }

  return (
    <div className='opacity-70 transition-opacity hover:opacity-100'>
      {logoElement}
    </div>
  )
}

export default Footer
