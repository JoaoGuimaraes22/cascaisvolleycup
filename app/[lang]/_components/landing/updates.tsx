import Image from 'next/image'
import LandingTestimonials, { type TestimonialsDict } from './testimonials'

const SHARED_ASSETS = {
  background: '/img/landing/home-page-2.webp',
  waveTop: '/img/global/ondas-4.webp'
} as const

type Props = {
  testimonialsDict: TestimonialsDict
}

export default function LandingUpdates({ testimonialsDict }: Props) {
  return (
    <section className='relative isolate overflow-hidden bg-white pb-6 sm:pb-8'>
      <div className='absolute inset-0 -z-10 bg-white'>
        <Image
          src={SHARED_ASSETS.background}
          alt=''
          fill
          className='bg-white object-cover'
          quality={70}
          sizes='100vw'
        />
      </div>

      <div className='absolute inset-x-0 top-0 z-0 h-[60px] sm:h-[80px] lg:h-[120px]'>
        <Image
          src={SHARED_ASSETS.waveTop}
          alt=''
          fill
          className='object-cover object-center'
          quality={65}
          sizes='100vw'
        />
      </div>

      <div className='relative z-10 pt-[60px] sm:pt-[80px] lg:pt-[120px]'>
        <LandingTestimonials dict={testimonialsDict} />
      </div>
    </section>
  )
}
