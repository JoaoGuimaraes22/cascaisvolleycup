import SectionWave from '../global/section-wave'
import { WAVE_HEIGHT } from '../../_lib/constants'

type Props = {
  dict: { Latest_news: string }
}

/**
 * Suspense fallback for <NewsSection>. Mirrors the section shell + card structure
 * of news.tsx / news-card.tsx so it roughly reserves the section's height while the
 * Sanity fetch resolves. The strip is far below the fold, so an exact pixel match
 * isn't required to keep CLS ~0 — this exists mainly to avoid a visible pop-in.
 */
export default function NewsSectionSkeleton({ dict }: Props) {
  return (
    <section
      aria-hidden
      className='relative isolate overflow-hidden bg-white py-12 sm:py-16 lg:py-20'
      style={{ paddingBottom: `${WAVE_HEIGHT}px` }}
    >
      <div className='mx-auto max-w-screen-xl px-4'>
        <h2 className='mb-6 text-2xl font-extrabold tracking-wide text-sky-500 uppercase sm:text-3xl'>
          {dict.Latest_news}
        </h2>

        <div className='flex gap-4 overflow-hidden pb-2'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className='shrink-0 basis-full sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(25%-0.75rem)]'
            >
              <div className='rounded-xl bg-white/90 p-2 shadow-sm ring-1 ring-black/5'>
                <div className='h-40 w-full rounded-lg bg-slate-100 motion-safe:animate-pulse sm:h-44' />
                <div className='px-2 py-4'>
                  <div className='h-5 w-3/4 rounded bg-slate-100' />
                  <div className='mt-3 h-3 w-1/3 rounded bg-slate-100' />
                  <div className='mt-4 h-4 w-full rounded bg-slate-100' />
                  <div className='mt-2 h-4 w-2/3 rounded bg-slate-100' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SectionWave />
    </section>
  )
}
