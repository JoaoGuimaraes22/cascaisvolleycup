'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center'>
      <h1 className='text-3xl font-bold tracking-tight'>
        Something went wrong
      </h1>
      <button
        type='button'
        onClick={reset}
        className='bg-primary rounded-full px-6 py-3 text-sm font-bold tracking-wide text-white uppercase shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl'
      >
        Try again
      </button>
    </div>
  )
}
