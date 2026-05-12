import Image from 'next/image'
import { WAVE_HEIGHT, GLOBAL_ASSETS } from '../../_lib/constants'

export default function SectionWave() {
  return (
    <div
      className='absolute inset-x-0 bottom-0 z-20'
      style={{ height: `${WAVE_HEIGHT}px` }}
    >
      <Image
        src={GLOBAL_ASSETS.wave}
        alt=''
        fill
        className='object-cover object-center'
        unoptimized
        sizes='100vw'
      />
    </div>
  )
}
