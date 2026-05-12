import Image from 'next/image'
import Link from 'next/link'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import { FiArrowLeft } from 'react-icons/fi'
import { urlFor } from '../../_lib/sanity-image'
import { localeHref } from '../../_lib/seo'
import { formatNewsDate } from '../../_lib/format-date'
import { NEWS_IMAGE } from '../../_lib/constants'
import { portableTextComponents } from './portable-text-components'
import type { NewsPostData } from '../../_lib/news'
import type { Locale } from '@/i18n-config'

type Props = {
  lang: Locale
  post: NewsPostData
  dict: { backToNews: string }
}

export default function NewsArticle({ lang, post, dict }: Props) {
  const heroUrl = urlFor(post.image)
    .width(NEWS_IMAGE.hero.width)
    .height(NEWS_IMAGE.hero.height)
    .fit('crop')
    .url()

  return (
    <article className='mx-auto max-w-3xl px-4 py-12 sm:py-16'>
      <Link
        href={localeHref(lang, '/news')}
        className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-sky-900'
      >
        <FiArrowLeft className='h-4 w-4' aria-hidden='true' />
        {dict.backToNews}
      </Link>

      <header className='mb-8'>
        <p className='text-sm text-slate-500'>
          {formatNewsDate(post.publishedAt, lang)}
        </p>
        <h1 className='mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl'>
          {post.title}
        </h1>
        <p className='mt-3 text-lg text-slate-600'>{post.description}</p>
      </header>

      <div className='relative mb-10 overflow-hidden rounded-xl bg-slate-100'>
        <Image
          src={heroUrl}
          alt={post.imageAlt ?? post.title}
          width={NEWS_IMAGE.hero.width}
          height={NEWS_IMAGE.hero.height}
          priority
          sizes='(max-width: 768px) 100vw, 768px'
          className='h-auto w-full'
        />
      </div>

      <PortableText
        value={post.body as PortableTextBlock | PortableTextBlock[]}
        components={portableTextComponents}
      />
    </article>
  )
}
