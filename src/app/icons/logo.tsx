'use client'

import Image from 'next/image'
import icon from './icon.svg'

export default function LogoIcon() {
  return (
    <Image
      src={icon}
      alt='Cascais Volley Cup Logo'
      className='h-full w-full object-contain'
      priority
    />
  )
}
