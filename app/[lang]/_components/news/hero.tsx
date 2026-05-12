type Props = {
  dict: { title: string; description: string }
}

export default function NewsHero({ dict }: Props) {
  return (
    <section className='mx-auto max-w-screen-xl px-4 pt-12 pb-8 sm:pt-16 sm:pb-12'>
      <h1 className='text-3xl font-extrabold tracking-tight text-sky-700 uppercase sm:text-4xl'>
        {dict.title}
      </h1>
      <p className='mt-3 max-w-2xl text-base text-slate-600 sm:text-lg'>
        {dict.description}
      </p>
    </section>
  )
}
