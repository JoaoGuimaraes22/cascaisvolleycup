type Props = {
  dict: { noPostsYet: string }
}

export default function NewsEmpty({ dict }: Props) {
  return (
    <div className='mx-auto max-w-screen-xl px-4 pb-24 text-center'>
      <p className='text-lg text-slate-500'>{dict.noPostsYet}</p>
    </div>
  )
}
