import Image from 'next/image'
import type { PortableTextComponents } from '@portabletext/react'
import { urlFor } from '../../_lib/sanity-image'
import { NEWS_IMAGE } from '../../_lib/constants'
import type { SanityImageRef } from '../../_lib/news'

export const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className='mt-10 mb-4 text-2xl font-bold text-slate-900 sm:text-3xl'>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className='mt-8 mb-3 text-xl font-semibold text-slate-900 sm:text-2xl'>
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className='my-6 border-l-4 border-sky-500 pl-4 text-slate-700 italic'>
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className='my-4 leading-relaxed text-slate-700'>{children}</p>
    )
  },
  list: {
    bullet: ({ children }) => (
      <ul className='my-4 list-disc space-y-2 pl-6 text-slate-700'>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className='my-4 list-decimal space-y-2 pl-6 text-slate-700'>
        {children}
      </ol>
    )
  },
  marks: {
    strong: ({ children }) => (
      <strong className='font-semibold'>{children}</strong>
    ),
    em: ({ children }) => <em className='italic'>{children}</em>,
    link: ({ value, children }) => {
      const v = value as { href?: string; blank?: boolean } | undefined
      const href = v?.href ?? '#'
      const external = /^https?:\/\//i.test(href)
      const openBlank = v?.blank || external
      return (
        <a
          href={href}
          target={openBlank ? '_blank' : undefined}
          rel={openBlank ? 'noopener noreferrer' : undefined}
          className='text-sky-700 underline underline-offset-2 hover:text-sky-900'
        >
          {children}
        </a>
      )
    }
  },
  types: {
    image: ({ value }) => {
      const v = value as SanityImageRef & { alt?: string }
      const url = urlFor(v).width(NEWS_IMAGE.body.width).fit('max').url()
      return (
        <figure className='my-8'>
          <Image
            src={url}
            alt={v.alt ?? ''}
            width={NEWS_IMAGE.body.width}
            height={NEWS_IMAGE.body.height}
            sizes='(max-width: 768px) 100vw, 768px'
            className='h-auto w-full rounded-lg'
          />
          {v.alt && (
            <figcaption className='mt-2 text-center text-sm text-slate-500'>
              {v.alt}
            </figcaption>
          )}
        </figure>
      )
    }
  }
}
