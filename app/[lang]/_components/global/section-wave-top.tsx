import Image from 'next/image'

export default function SectionWaveTop() {
  return (
    <div className='absolute inset-x-0 top-0 z-0 h-[60px] sm:h-[80px] lg:h-[120px]'>
      <Image
        src='/img/global/ondas-4.webp'
        alt=''
        fill
        className='object-cover object-center'
        quality={65}
        sizes='100vw'
      />
    </div>
  )
}
